import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI SDK
export const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export const MODEL_NAME = 'gemini-3-flash-preview';
