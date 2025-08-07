import axios from 'axios';
import {
  Language,
  Style,
  TranslateRequest,
  TranslateResponse,
  StyleTransformRequest,
  StyleTransformResponse,
  CreativeRequest,
  CreativeResponse,
  AnalyzeRequest,
  AnalyzeResponse,
  CreativeTypesResponse,
} from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for loading states
apiClient.interceptors.request.use((config) => {
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Get available languages
  async getLanguages(): Promise<{ languages: Language }> {
    const response = await apiClient.get('/languages');
    return response.data;
  },

  // Get available styles
  async getStyles(): Promise<{ styles: Style }> {
    const response = await apiClient.get('/styles');
    return response.data;
  },

  // Get creative types
  async getCreativeTypes(): Promise<CreativeTypesResponse> {
    const response = await apiClient.get('/creative-types');
    return response.data;
  },

  // Analyze text
  async analyzeText(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    const response = await apiClient.post('/analyze', request);
    return response.data;
  },

  // Translate text
  async translateText(request: TranslateRequest): Promise<TranslateResponse> {
    const response = await apiClient.post('/translate', request);
    return response.data;
  },

  // Transform style
  async transformStyle(request: StyleTransformRequest): Promise<StyleTransformResponse> {
    const response = await apiClient.post('/transform-style', request);
    return response.data;
  },

  // Create creative content
  async createCreative(request: CreativeRequest): Promise<CreativeResponse> {
    const response = await apiClient.post('/creative', request);
    return response.data;
  },

  // Health check
  async healthCheck(): Promise<{ message: string; version: string }> {
    const response = await apiClient.get('/');
    return response.data;
  },
};

export default apiService;
