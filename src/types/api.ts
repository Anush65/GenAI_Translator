export interface Language {
  [key: string]: string;
}

export interface Style {
  [key: string]: string;
}

export interface TranslateRequest {
  text: string;
  target_language: string;
  source_language?: string;
  style?: string;
  preserve_formatting?: boolean;
}

export interface TranslateResponse {
  original_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  style: string;
  message?: string;
}

export interface StyleTransformRequest {
  text: string;
  target_style: string;
  context?: string;
  creativity_level?: number;
}

export interface StyleTransformResponse {
  original_text: string;
  transformed_text: string;
  target_style: string;
  creativity_level: number;
}

export interface CreativeRequest {
  text: string;
  creative_type: string;
  theme?: string;
  mood?: string;
  creativity_level?: number;
}

export interface CreativeResponse {
  original_text: string;
  creative_content: string;
  creative_type: string;
  theme?: string;
  mood: string;
}

export interface AnalyzeRequest {
  text: string;
}

export interface AnalyzeResponse {
  detected_language: string;
  language_name: string;
  analysis: any;
}

export interface CreativeType {
  value: string;
  label: string;
  description: string;
}

export interface CreativeTypesResponse {
  creative_types: CreativeType[];
}
