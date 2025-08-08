# 🌟 Creative Language Translator

An AI-powered creative language translator that goes beyond literal translation to preserve nuance, tone, and style while offering creative transformations and analysis.

Setup:
To run, do pip install -r requirements.txt first and then do npm install, and finally double click on the start.bat file in your folder

## ✨ Features

### 🔄 Core Translation
- **Multi-language Support**: Translate between 12+ languages including English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, and Hindi
- **Style Preservation**: Maintains original tone, formality, and cultural context
- **Auto-detection**: Automatically detects source language
- **Bidirectional Translation**: Easy language swapping with one click

### 🎨 Style Transformation
- **10+ Writing Styles**: Transform text between formal, casual, academic, poetic, humorous, Shakespearean, modern slang, business, storytelling, and technical styles
- **Creativity Control**: Adjustable creativity level (10-90%)
- **Context Awareness**: Optional context input for better transformations
- **Advanced Settings**: Fine-tune transformation parameters

### 🎭 Creative Content Generation
- **8 Creative Formats**: 
  - Poems with vivid imagery and metaphors
  - Song lyrics with verses and chorus
  - Short stories with narrative arcs
  - Haikus following 5-7-5 pattern
  - Limericks with AABBA rhyme scheme
  - Sonnets with 14-line structure
  - Rap verses with rhythm and wordplay
  - Dialogue in conversational format
- **Mood Selection**: 8 different moods (joyful, melancholy, mysterious, romantic, energetic, peaceful, dramatic, neutral)
- **Theme Support**: Optional themes for focused creative output

### 📊 Text Analysis
- **Language Detection**: Automatic language identification
- **Sentiment Analysis**: Positive, negative, or neutral sentiment detection
- **Style Analysis**: Tone, writing style, and formality assessment
- **Complexity Analysis**: Text complexity and readability scoring
- **Statistics**: Character, word, sentence count and average word length
- **Cultural Context**: Identification of cultural references and idioms

### 🎯 Unique Features
- **Voice Preservation**: AI maintains original author's voice and style
- **Cultural Adaptation**: Culturally appropriate expressions and idioms
- **Creative Rephrasing**: Transform content into entirely different formats
- **Idiomatic Translation**: Natural handling of slang and idioms
- **Real-time Analysis**: Instant feedback on text characteristics

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for beautiful components
- **Framer Motion** for smooth animations
- **Axios** for API communication
- **Custom Particle Background** for visual appeal

### Backend
- **FastAPI** for high-performance API
- **Google Gemini Pro** for AI-powered translations and transformations (FREE!)
- **Google Translate API** as fallback
- **Language Detection** for automatic source language identification
- **NLTK** for text processing

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn
- Python 3.8+
- Google API Key (FREE from Google AI Studio)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd creative-language-translator
```

### 2. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env and add your Google API key
# Get FREE API key from: https://makersuite.google.com/app/apikey
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

### 3. Frontend Setup

```bash
# Install Node dependencies
npm install
```

### 4. Get Google Gemini API Key (FREE)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Add it to your `.env` file

### 5. Run the Application

```bash
# Terminal 1: Start the backend
cd backend
python main.py

# Terminal 2: Start the frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 🎯 Usage Examples

### Language Translation
```
Input: "Hello, how are you today?"
Target: Spanish (Formal style)
Output: "Hola, ¿cómo está usted hoy?"
```

### Style Transformation
```
Input: "Hey, what's up? Can you help me?"
Style: Formal
Output: "Good day, how are you? Could you assist me, please?"
```

### Creative Generation
```
Input: "A lonely lighthouse keeper"
Type: Poem
Mood: Melancholy
Output: A beautiful poem about solitude and watching over the sea...
```

### Text Analysis
```
Input: "I absolutely love this new technology!"
Analysis: 
- Language: English
- Sentiment: Positive
- Tone: Enthusiastic
- Style: Informal
- Complexity: Simple
```

## 🏆 Hackathon Features

### What Makes This Special
1. **Free AI Integration**: Uses Google Gemini (no cost!)
2. **Beautiful UI**: Modern glassmorphism design with animations
3. **Comprehensive Functionality**: 4 main features in one app
4. **Unique Creative Modes**: 8 different creative output formats
5. **Cultural Intelligence**: Handles idioms and cultural context
6. **Real-time Analysis**: Instant feedback and statistics
7. **Accessibility**: Intuitive interface with example prompts

### Technical Highlights
- **Particle Background Animation**: Custom canvas-based particle system
- **Smooth Transitions**: Framer Motion animations throughout
- **Responsive Design**: Works perfectly on desktop and mobile
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Graceful fallbacks and user feedback
- **Performance**: Optimized API calls and caching

## 📱 Screenshots

[The app features a beautiful dark theme with glassmorphism effects, smooth animations, and an intuitive tabbed interface]

## 🔧 API Endpoints

- `GET /languages` - Get available languages
- `GET /styles` - Get available writing styles
- `GET /creative-types` - Get creative content types
- `POST /translate` - Translate text with style preservation
- `POST /transform-style` - Transform writing style
- `POST /creative` - Generate creative content
- `POST /analyze` - Analyze text characteristics

## 🌍 Supported Languages

English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese (Simplified), Arabic, Hindi

## 🎨 Available Styles

Formal, Casual, Academic, Poetic, Humorous, Shakespearean, Modern Slang, Business, Storytelling, Technical

## 🎭 Creative Formats

Poem, Song Lyrics, Short Story, Haiku, Limerick, Sonnet, Rap Verse, Dialogue

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini for free AI capabilities
- Material-UI for beautiful components
- Framer Motion for smooth animations
- FastAPI for the excellent Python framework

---


Made with ❤️ for the hackathon challenge
