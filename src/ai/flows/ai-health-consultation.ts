'use server';
/**
 * @fileOverview Provides doctor-like responses and medical recommendations based on user input.
 *
 * - aiHealthConsultation - A function that handles the health consultation process.
 * - AIHealthConsultationInput - The input type for the aiHealthConsultation function.
 * - AIHealthConsultationOutput - The return type for the aiHealthConsultation function.
 */

import { ai, MODEL_NAME } from '@/ai/genkit';
import { Type } from '@google/genai';

export interface AIHealthConsultationInput {
  query: string;
}

export interface Recommendation {
  condition: string;
  description: string;
  advice: string;
}

export interface AIHealthConsultationOutput {
  response?: string;
  recommendations?: Recommendation[];
}

export async function aiHealthConsultation(input: AIHealthConsultationInput): Promise<AIHealthConsultationOutput> {
  const prompt = `You are an expert AI psychiatrist with over 30 years of experience and have successfully treated thousands of patients. Engage in a supportive and empathetic conversation.

If the user's query is about a specific disease, provide the information in a tabular format using the 'recommendations' field. Otherwise, provide a conversational response using the 'response' field.

Query: ${input.query}`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          response: {
            type: Type.STRING,
            description: 'A conversational response from the AI psychiatrist.',
          },
          recommendations: {
            type: Type.ARRAY,
            description: 'A list of recommendations and advice.',
            items: {
              type: Type.OBJECT,
              properties: {
                condition: { type: Type.STRING, description: 'The name of the possible medical condition.' },
                description: { type: Type.STRING, description: 'A brief description of the condition.' },
                advice: { type: Type.STRING, description: 'The recommended course of action or advice.' },
              },
              required: ['condition', 'description', 'advice'],
            },
          },
        },
      },
    },
  });

  return JSON.parse(response.text) as AIHealthConsultationOutput;
}
