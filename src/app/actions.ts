'use server';

import { aiHealthConsultation } from '@/ai/flows/ai-health-consultation';
import type { AIHealthConsultationOutput } from '@/ai/flows/ai-health-consultation';
import { getMoodInsight } from '@/ai/flows/mood-insights';
import type { MoodInsightOutput } from '@/ai/flows/mood-insights';
import { getMoodSummary } from '@/ai/flows/mood-summary';
import type { MoodSummaryInput, MoodSummaryOutput } from '@/ai/flows/mood-summary';
import { getDailyQuestion } from '@/ai/flows/daily-question';
import type { DailyQuestionOutput } from '@/ai/flows/daily-question';
import { generateFeed } from '@/ai/flows/generate-feed';
import type { GenerateFeedOutput } from '@/ai/flows/generate-feed';


export async function getAiReply(
  query: string
): Promise<AIHealthConsultationOutput> {
  if (!query) {
    throw new Error('Query cannot be empty.');
  }

  try {
    const result = await aiHealthConsultation({ query });
    return result;
  } catch (error) {
    console.error('Error getting AI reply:', error);
    throw new Error('Failed to get a response from the AI assistant.');
  }
}

export async function getAiMoodInsight(
  mood: string
): Promise<MoodInsightOutput> {
  if (!mood) {
    throw new Error('Mood cannot be empty.');
  }

  try {
    const result = await getMoodInsight({ mood });
    return result;
  } catch (error) {
    console.error('Error getting AI mood insight:', error);
    throw new Error('Failed to get a response from the AI assistant.');
  }
}

export async function getAiMoodSummary(
  input: MoodSummaryInput
): Promise<MoodSummaryOutput> {
  if (!input.mood || !input.profile) {
    throw new Error('Mood and profile cannot be empty.');
  }

  try {
    const result = await getMoodSummary(input);
    return result;
  } catch (error) {
    console.error('Error getting AI mood summary:', error);
    throw new Error('Failed to get a response from the AI assistant.');
  }
}

export async function getAiDailyQuestion(): Promise<DailyQuestionOutput> {
  try {
    const result = await getDailyQuestion();
    return result;
  } catch (error) {
    console.error('Error getting AI daily question:', error);
    // Return a fallback question in case of an error
    return {
      question: 'What is one thing you are grateful for today?',
    };
  }
}

export async function getAiFeed(): Promise<GenerateFeedOutput> {
  try {
    const result = await generateFeed();
    return result;
  } catch (error) {
    console.error('Error generating AI feed:', error);
    throw new Error('Failed to get a response from the AI assistant.');
  }
}
