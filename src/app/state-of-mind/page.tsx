'use client';
import { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { ArrowLeft, CalendarDays, Lightbulb } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useMood } from '@/context/mood-context';
import DailyMood from '@/components/daily-mood';
import { getAiMoodSummary } from '../actions';
import type { MoodSummaryOutput } from '@/ai/flows/mood-summary';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { moodData } from '@/context/mood-context';
import AuthGuard from '@/components/auth-guard';

function StateOfMindPageContent() {
  const { moods } = useMood();
  const mood = moods[0] || null;
  const [today, setToday] = useState('');
  const [aiResponse, setAiResponse] = useState<MoodSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userProfile = {
    name: 'Anvesha',
    age: 21,
    gender: 'Female',
    country: 'India',
    sleepHours: 7,
    interests: ['Reading', 'Music', 'Exercise'],
    stressors: ['Deadlines', 'Work', 'School'],
  };

  useEffect(() => {
    setToday(format(new Date(), 'd LLL'));
  }, []);

  useEffect(() => {
    async function fetchSummary() {
      if (mood) {
        setIsLoading(true);
        setAiResponse(null);
        try {
          const result = await getAiMoodSummary({
            mood: mood.name,
            profile: userProfile,
          });
          setAiResponse(result);
        } catch (error) {
          console.error(error);
          setAiResponse({
            summary:
              'Could not load AI summary. Keep logging your mood to get personalized insights.',
            tips: [],
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setAiResponse(null);
      }
    }
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moods]);

  const moodModifiers = moodData.reduce(
    (acc: Record<string, Date[]>, moodType) => {
      acc[moodType.name] = moods
        .filter(m => m.name === moodType.name)
        .map(m => m.date);
      return acc;
    },
    {}
  );

  const moodModifierStyles = moodData.reduce(
    (acc: Record<string, React.CSSProperties>, moodType) => {
      acc[moodType.name] = {
        backgroundColor: `${moodType.color.replace(')', ', 0.3)')}`,
        color: moodType.color.startsWith('hsl(0')
          ? 'hsl(var(--destructive-foreground))'
          : 'hsl(var(--foreground))',
        borderRadius: '50%',
      };
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">State of Mind</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <CalendarDays className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              modifiers={moodModifiers}
              modifiersStyles={moodModifierStyles}
            />
          </PopoverContent>
        </Popover>
      </header>
      <main className="flex-1 flex-col items-center p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Today, {today}</h2>
          <Button
            asChild
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/home">Log Mood</Link>
          </Button>
        </div>

        <Card className="w-full bg-card/80 border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-center text-xs font-medium text-muted-foreground tracking-widest">
              DAILY MOOD
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6 pt-6 pb-12">
            <DailyMood mood={mood} />
            <h3 className="text-2xl font-medium">
              {mood ? `A ${mood.name} Day ${mood.emoji}` : 'No mood logged'}
            </h3>
          </CardContent>
        </Card>

        <Separator className="my-8 bg-border/50" />

        {isLoading && (
          <div className="space-y-6">
            <Card className="bg-card/80 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-700">
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
            <Card className="bg-card/80 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-700">
                  Wellness Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {aiResponse && !isLoading && (
          <div className="space-y-6">
            <Card className="bg-card/80 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-700">
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{aiResponse.summary}</p>
              </CardContent>
            </Card>

            {aiResponse.tips.length > 0 && (
              <Card className="bg-card/80 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-700">
                    Wellness Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiResponse.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {tip.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}


export default function StateOfMindPage() {
  return (
    <AuthGuard>
      <StateOfMindPageContent />
    </AuthGuard>
  );
}
