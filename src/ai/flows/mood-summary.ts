'use server';
/**
 * @fileOverview Provides AI-generated summaries and wellness tips based on user's mood and profile.
 *
 * - getMoodSummary - A function that handles the mood summary and tips generation process.
 * - MoodSummaryInput - The input type for the getMoodSummary function.
 * - MoodSummaryOutput - The return type for the getMoodSummary function.
 */

import { ai, MODEL_NAME } from '@/ai/genkit';
import { Type } from '@google/genai';

export interface Profile {
  name: string;
  age: number;
  gender: string;
  country: string;
  sleepHours: number;
  interests: string[];
  stressors: string[];
}

export interface MoodSummaryInput {
  mood: string;
  profile: Profile;
}

export interface WellnessTip {
  title: string;
  description: string;
}

export interface MoodSummaryOutput {
  summary: string;
  tips: WellnessTip[];
}

export async function getMoodSummary(input: MoodSummaryInput): Promise<MoodSummaryOutput> {
  const prompt = `You are a compassionate AI assistant. A user has logged their mood as '${input.mood}'. 

Analyze their mood in the context of their profile:
- Name: ${input.profile.name}
- Age: ${input.profile.age}
- Interests: ${input.profile.interests.join(', ')}
- Common Stressors: ${input.profile.stressors.join(', ')}
- Typical Sleep: ${input.profile.sleepHours} hours

Based on this, provide a personalized, 1-2 sentence summary of their mood.

Then, provide 2-3 actionable wellness tips tailored to their mood and profile. Connect the tips to their interests and stressors. For example, if they like 'Music' and are 'Stressed', suggest listening to a calming playlist.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: "A personalized, 1-2 sentence summary of the user's mood, taking their profile into account.",
          },
          tips: {
            type: Type.ARRAY,
            description: "A list of 2-3 actionable wellness tips tailored to the user's mood and profile.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'A short, catchy title for the wellness tip.' },
                description: { type: Type.STRING, description: 'A brief explanation of the wellness tip.' },
              },
              required: ['title', 'description'],
            },
          },
        },
      },
    },
  });

  return JSON.parse(response.text) as MoodSummaryOutput;
}
