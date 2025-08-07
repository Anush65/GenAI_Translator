from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
import google.generativeai as genai
from langdetect import detect
from deep_translator import GoogleTranslator
import nltk
from textblob import TextBlob
import re
import json
import random

load_dotenv()

app = FastAPI(title="Creative Language Translator", description="AI-powered creative language translator with style transformation")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini AI
google_api_key = os.getenv("GOOGLE_API_KEY")
gemini_model = None

if google_api_key:
    try:
        genai.configure(api_key=google_api_key)
        # Try different model names in order of preference
        model_names = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro']
        
        for model_name in model_names:
            try:
                gemini_model = genai.GenerativeModel(model_name)
                # Test the model with a simple request
                test_response = gemini_model.generate_content("Hello")
                print(f"✅ Successfully initialized Gemini model: {model_name}")
                break
            except Exception as e:
                print(f"❌ Failed to initialize {model_name}: {str(e)}")
                continue
        
        if not gemini_model:
            print("❌ No working Gemini model found. Available models:")
            try:
                for model in genai.list_models():
                    if 'generateContent' in model.supported_generation_methods:
                        print(f"  - {model.name}")
            except Exception as e:
                print(f"Could not list models: {e}")
                
    except Exception as e:
        print(f"❌ Failed to configure Gemini API: {str(e)}")
        gemini_model = None
else:
    print("❌ No GOOGLE_API_KEY found in environment variables")

# translator = GoogleTranslator(source='auto', target='en')  # will be set dynamically

# Download NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

# Request models
class TranslateRequest(BaseModel):
    text: str
    target_language: str
    source_language: Optional[str] = None
    style: Optional[str] = "neutral"
    preserve_formatting: bool = True

class StyleTransformRequest(BaseModel):
    text: str
    target_style: str
    context: Optional[str] = None
    creativity_level: float = 0.7

class CreativeRequest(BaseModel):
    text: str
    creative_type: str  # poem, song, story, etc.
    theme: Optional[str] = None
    mood: Optional[str] = "neutral"

# Language and style mappings
LANGUAGES = {
    "en": "English",
    "es": "Spanish", 
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "ru": "Russian",
    "ja": "Japanese",
    "ko": "Korean",
    "zh": "Chinese",
    "ar": "Arabic",
    "hi": "Hindi"
}

STYLES = {
    "formal": "Professional and formal tone",
    "casual": "Relaxed and informal tone",
    "academic": "Scholarly and precise language",
    "poetic": "Lyrical and metaphorical expression",
    "humorous": "Light-hearted and funny",
    "shakespearean": "Elizabethan English style",
    "modern_slang": "Contemporary informal language",
    "business": "Corporate and professional",
    "storytelling": "Narrative and engaging",
    "technical": "Precise and technical terminology"
}

def detect_language(text: str) -> str:
    """Detect the language of input text"""
    try:
        return detect(text)
    except:
        return "en"

def analyze_tone_and_style(text: str) -> Dict[str, Any]:
    """Analyze the tone and style of input text using AI"""
    prompt = f"""
    Analyze the following text for tone, style, and characteristics:
    
    Text: "{text}"
    
    Please provide a JSON response with:
    - tone: (formal/informal/neutral/emotional/etc.)
    - style: (descriptive/narrative/persuasive/technical/etc.)
    - complexity: (simple/moderate/complex)
    - emotion: (positive/negative/neutral)
    - formality_level: (1-10 scale)
    - cultural_context: any cultural references or idioms
    """
    
    try:
        if gemini_model:
            response = gemini_model.generate_content(prompt)
            return {"analysis": response.text}
        else:
            # Fallback to basic analysis
            blob = TextBlob(text)
            return {
                "tone": "neutral",
                "style": "general",
                "complexity": "moderate",
                "emotion": "positive" if blob.sentiment.polarity > 0 else "negative" if blob.sentiment.polarity < 0 else "neutral",
                "formality_level": 5,
                "cultural_context": "general"
            }
    except Exception as e:
        return {"error": str(e)}

def creative_translate_with_ai(text: str, target_lang: str, source_lang: str, style: str) -> str:
    """Use AI for creative translation that preserves nuance and style"""
    
    source_name = LANGUAGES.get(source_lang, source_lang)
    target_name = LANGUAGES.get(target_lang, target_lang)
    style_desc = STYLES.get(style, style)
    
    prompt = f"""
    You are a master translator who specializes in creative and nuanced translation that preserves the original meaning, tone, style, and cultural context.
    
    Task: Translate the following {source_name} text to {target_name} while maintaining the {style_desc} style.
    
    Original text: "{text}"
    
    Requirements:
    1. Preserve the original meaning and emotional tone
    2. Maintain the {style} style throughout
    3. Use culturally appropriate expressions in {target_name}
    4. Handle idioms and slang naturally
    5. Keep the same level of formality
    6. Preserve any wordplay or literary devices when possible
    
    Provide only the translation without explanations.
    """
    
    try:
        if gemini_model:
            response = gemini_model.generate_content(prompt)
            return response.text.strip()
        else:
            # Fallback to Google Translate
            print("ℹ️ Using Google Translate fallback for translation")
            translator = GoogleTranslator(source=source_lang, target=target_lang)
            result = translator.translate(text)
            return result
    except Exception as e:
        # Fallback to Google Translate
        print(f"⚠️ Gemini translation failed: {e}, trying Google Translate fallback")
        try:
            translator = GoogleTranslator(source=source_lang, target=target_lang)
            result = translator.translate(text)
            return f"[Google Translate] {result}"
        except Exception as fallback_error:
            return f"⚠️ Translation failed: {str(e)}. Fallback also failed: {str(fallback_error)}"

def transform_style_with_ai(text: str, target_style: str, context: str = None, creativity: float = 0.7) -> str:
    """Transform text style using AI while preserving meaning"""
    
    style_desc = STYLES.get(target_style, target_style)
    context_info = f"Context: {context}" if context else ""
    
    prompt = f"""
    Transform the following text to match the {target_style} style ({style_desc}).
    
    Original text: "{text}"
    {context_info}
    
    Requirements:
    1. Preserve the core meaning and information
    2. Adapt the tone and style to be {style_desc}
    3. Use appropriate vocabulary and sentence structure
    4. Maintain coherence and readability
    5. Be creative but accurate (creativity level: {creativity})
    
    Provide only the transformed text without explanations.
    """
    
    try:
        if gemini_model:
            # Configure generation settings for creativity
            generation_config = genai.types.GenerationConfig(
                temperature=creativity,
                max_output_tokens=1500,
            )
            response = gemini_model.generate_content(prompt, generation_config=generation_config)
            return response.text.strip()
        else:
            return "⚠️ AI service not available. Please check your Google API key and internet connection."
    except Exception as e:
        error_msg = str(e)
        if "404" in error_msg or "not found" in error_msg.lower():
            return "⚠️ Gemini model not available. The service may be updating. Please try again in a few moments."
        elif "quota" in error_msg.lower() or "limit" in error_msg.lower():
            return "⚠️ API quota exceeded. Please check your Google AI Studio usage limits."
        elif "key" in error_msg.lower() or "auth" in error_msg.lower():
            return "⚠️ Invalid API key. Please check your Google API key in the .env file."
        else:
            return f"⚠️ Style transformation error: {error_msg}"

def create_creative_content(text: str, creative_type: str, theme: str = None, mood: str = "neutral") -> str:
    """Generate creative content based on input text"""
    
    theme_info = f"Theme: {theme}" if theme else ""
    
    prompt = f"""
    Transform the following text into a {creative_type} with a {mood} mood.
    
    Original text: "{text}"
    {theme_info}
    
    Creative requirements for {creative_type}:
    """
    
    if creative_type == "poem":
        prompt += """
        - Use poetic devices (metaphor, alliteration, rhythm)
        - Create meaningful line breaks and stanzas
        - Maintain emotional resonance
        - Include vivid imagery
        """
    elif creative_type == "song":
        prompt += """
        - Structure with verses and a chorus
        - Use rhyme and rhythm suitable for music
        - Include emotional hooks and repetition
        - Make it singable and memorable
        """
    elif creative_type == "story":
        prompt += """
        - Create a narrative arc with beginning, middle, end
        - Develop characters and setting
        - Use descriptive language and dialogue
        - Build tension and resolution
        """
    elif creative_type == "haiku":
        prompt += """
        - Follow 5-7-5 syllable pattern
        - Focus on nature or moment in time
        - Create a sense of tranquility or insight
        - Use simple, evocative language
        """
    elif creative_type == "rap":
        prompt += """
        - Use strong rhythm and rhyme schemes
        - Include wordplay and clever lyrics
        - Build flow and momentum
        - Make it rhythmic and catchy
        """
    elif creative_type == "limerick":
        prompt += """
        - Follow AABBA rhyme scheme
        - Use humor and wit
        - Keep it light and playful
        - Follow traditional limerick meter
        """
    
    prompt += f"\nMood: {mood}\nProvide only the creative content without explanations."
    
    try:
        if gemini_model:
            generation_config = genai.types.GenerationConfig(
                temperature=0.8,
                max_output_tokens=1500,
            )
            response = gemini_model.generate_content(prompt, generation_config=generation_config)
            return response.text.strip()
        else:
            return "⚠️ AI service not available for creative content generation. Please check your Google API key."
    except Exception as e:
        error_msg = str(e)
        if "404" in error_msg or "not found" in error_msg.lower():
            return "⚠️ Gemini model not available. Please try again in a few moments."
        elif "quota" in error_msg.lower() or "limit" in error_msg.lower():
            return "⚠️ API quota exceeded. Please check your Google AI Studio usage limits."
        else:
            return f"⚠️ Creative content error: {error_msg}"

@app.get("/")
async def root():
    return {"message": "Creative Language Translator API", "version": "1.0.0"}

@app.get("/languages")
async def get_languages():
    """Get available languages"""
    return {"languages": LANGUAGES}

@app.get("/styles")
async def get_styles():
    """Get available styles"""
    return {"styles": STYLES}

@app.post("/analyze")
async def analyze_text(request: dict):
    """Analyze text for tone, style, and characteristics"""
    text = request.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    detected_lang = detect_language(text)
    analysis = analyze_tone_and_style(text)
    
    return {
        "detected_language": detected_lang,
        "language_name": LANGUAGES.get(detected_lang, "Unknown"),
        "analysis": analysis
    }

@app.post("/translate")
async def translate_text(request: TranslateRequest):
    """Translate text between languages with style preservation"""
    try:
        source_lang = request.source_language or detect_language(request.text)
        
        if source_lang == request.target_language:
            return {
                "original_text": request.text,
                "translated_text": request.text,
                "source_language": source_lang,
                "target_language": request.target_language,
                "style": request.style,
                "message": "Source and target languages are the same"
            }
        
        translated = creative_translate_with_ai(
            request.text, 
            request.target_language, 
            source_lang, 
            request.style
        )
        
        return {
            "original_text": request.text,
            "translated_text": translated,
            "source_language": source_lang,
            "target_language": request.target_language,
            "style": request.style
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transform-style")
async def transform_style(request: StyleTransformRequest):
    """Transform text style while preserving meaning"""
    try:
        transformed = transform_style_with_ai(
            request.text,
            request.target_style,
            request.context,
            request.creativity_level
        )
        
        return {
            "original_text": request.text,
            "transformed_text": transformed,
            "target_style": request.target_style,
            "creativity_level": request.creativity_level
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/creative")
async def create_creative(request: CreativeRequest):
    """Generate creative content from input text"""
    try:
        creative_content = create_creative_content(
            request.text,
            request.creative_type,
            request.theme,
            request.mood
        )
        
        return {
            "original_text": request.text,
            "creative_content": creative_content,
            "creative_type": request.creative_type,
            "theme": request.theme,
            "mood": request.mood
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/creative-types")
async def get_creative_types():
    """Get available creative content types"""
    return {
        "creative_types": [
            {"value": "poem", "label": "Poem", "description": "Transform into poetic verse"},
            {"value": "song", "label": "Song Lyrics", "description": "Create singable lyrics"},
            {"value": "story", "label": "Short Story", "description": "Develop into narrative"},
            {"value": "haiku", "label": "Haiku", "description": "Japanese 5-7-5 syllable poem"},
            {"value": "limerick", "label": "Limerick", "description": "Humorous five-line poem"},
            {"value": "sonnet", "label": "Sonnet", "description": "14-line poetic form"},
            {"value": "rap", "label": "Rap Verse", "description": "Rhythmic spoken lyrics"},
            {"value": "dialogue", "label": "Dialogue", "description": "Conversational format"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
