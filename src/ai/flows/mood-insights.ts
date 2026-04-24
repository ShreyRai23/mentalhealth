'use server';
/**
 * @fileOverview Provides AI-generated insights based on the user's logged mood.
 *
 * - getMoodInsight - A function that handles the mood insight generation process.
 * - MoodInsightInput - The input type for the getMoodInsight function.
 * - MoodInsightOutput - The return type for the getMoodInsight function.
 */

import { ai, MODEL_NAME } from '@/ai/genkit';
import { Type } from '@google/genai';

export interface MoodInsightInput {
  mood: string;
}

export interface MoodInsightOutput {
  insight: string;
}

export async function getMoodInsight(input: MoodInsightInput): Promise<MoodInsightOutput> {
  const prompt = `You are a compassionate friend and AI assistant. A user has logged their mood as '${input.mood}'. 

Provide a short, 1-2 sentence, encouraging, and insightful message that acknowledges their feeling without being overly clinical. 

If the mood is positive, celebrate it. If it's negative, offer gentle support and acknowledgement. If it's neutral, provide a mindful observation.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          insight: {
            type: Type.STRING,
            description: 'A short, compassionate, and insightful message for the user based on their mood.',
          },
        },
      },
    },
  });

  return JSON.parse(response.text) as MoodInsightOutput;
}
