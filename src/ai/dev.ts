'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-health-consultation.ts';
import '@/ai/flows/mood-insights.ts';
import '@/ai/flows/mood-summary.ts';
import '@/ai/flows/daily-question.ts';
import '@/ai/flows/generate-feed.ts';
