'use server';
/**
 * @fileOverview Provides a unique, AI-generated wellness question for the daily check-in.
 *
 * - getDailyQuestion - A function that returns a daily wellness question.
 * - DailyQuestionOutput - The return type for the getDailyQuestion function.
 */

import { ai, MODEL_NAME } from '@/ai/genkit';
import { Type } from '@google/genai';

export interface DailyQuestionOutput {
  question: string;
}

export async function getDailyQuestion(): Promise<DailyQuestionOutput> {
  const prompt = `You are an AI assistant for a mental wellness app. Your task is to generate a single, short, and insightful question for a user's daily check-in.

The question should be:
- Open-ended and encourage self-reflection.
- Related to mindfulness, gratitude, personal growth, or emotional awareness.
- Different from a question you might have provided recently.
- Not a generic "how are you?".

Examples of good questions:
- "What is one small thing that brought you a moment of peace today?"
- "What is a personal strength you've relied on recently?"
- "Describe a sound or smell you noticed today that you usually ignore."
- "What is one task you're proud of completing this week?"

Generate a new question now.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: 'A short, insightful, and unique question related to mental wellness, self-reflection, or mindfulness.',
          },
        },
      },
    },
  });

  return JSON.parse(response.text) as DailyQuestionOutput;
}
