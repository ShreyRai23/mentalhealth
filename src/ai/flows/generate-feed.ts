'use server';
/**
 * @fileOverview Generates a list of unique, high-quality articles for the user's feed.
 *
 * - generateFeed - A function that returns a list of feed articles.
 * - GenerateFeedOutput - The return type for the generateFeed function.
 */

import { ai, MODEL_NAME } from '@/ai/genkit';
import { Type } from '@google/genai';

export interface FeedItem {
  id: number;
  author: string;
  title: string;
  description: string;
  imageHint: string;
  minutesToRead: number;
}

export interface GenerateFeedOutput {
  articles: FeedItem[];
}

export async function generateFeed(): Promise<GenerateFeedOutput> {
  const prompt = `You are an expert content creator for a mental wellness app called MindWell.

Your task is to generate a list of 4 unique, high-quality, and engaging articles for the user's feed. The topics should be diverse but centered around mental health, mindfulness, personal growth, resilience, and overall well-being.

For each article, provide a realistic author name (like a doctor, therapist, or wellness coach), a catchy title, a concise description, a hint for a relevant image (1-2 words), and an estimated reading time.

Ensure the articles are different from each other and offer practical, positive, and supportive advice. Do not repeat topics within the same batch of 4 articles.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          articles: {
            type: Type.ARRAY,
            description: 'An array of exactly 4 unique feed articles.',
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER, description: 'A unique integer identifier.' },
                author: { type: Type.STRING, description: 'The fictional author name.' },
                title: { type: Type.STRING, description: 'The compelling title of the article.' },
                description: { type: Type.STRING, description: 'A brief summary of the content.' },
                imageHint: { type: Type.STRING, description: 'One or two keywords for a stock photo.' },
                minutesToRead: { type: Type.INTEGER, description: 'The estimated reading time.' },
              },
              required: ['id', 'author', 'title', 'description', 'imageHint', 'minutesToRead'],
            },
          },
        },
      },
    },
  });

  return JSON.parse(response.text) as GenerateFeedOutput;
}
