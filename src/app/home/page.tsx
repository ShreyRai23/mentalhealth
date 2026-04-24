
'use client';
import {
  Flame,
  Heart,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MoodDial from '@/components/mood-dial';
import { useMood } from '@/context/mood-context';
import MoodHistory from '@/components/mood-history';
import { useMemo } from 'react';
import type { Mood } from '@/context/mood-context';
import AuthGuard from '@/components/auth-guard';

const SummaryCard = ({
  icon: Icon,
  title,
  colorClass = 'bg-primary',
  children,
}: {
  icon: React.ElementType;
  title: string;
  colorClass?: string;
  children: React.ReactNode;
}) => (
  <Card className="bg-card border-none shadow-lg rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative group">
    <div className={`absolute top-0 left-0 w-full h-1.5 ${colorClass}`} />
    <CardHeader className="flex flex-row items-center justify-between pb-2 text-muted-foreground mt-2">
      <CardTitle className="text-sm font-bold tracking-wide uppercase">{title}</CardTitle>
      <div className={`p-2 rounded-full ${colorClass} bg-opacity-10 text-${colorClass.replace('bg-', '')}`}>
        <Icon className="w-5 h-5" />
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

function HomePageContent() {
  const { moods } = useMood();
  const recentMood = moods[0] || null;

  const averageMood = useMemo(() => {
    if (moods.length === 0) return null;

    const moodCounts = moods.reduce((acc: { [key: string]: number }, mood: Mood) => {
      acc[mood.name] = (acc[mood.name] || 0) + 1;
      return acc;
    }, {});

    const mostFrequentMoodName = Object.keys(moodCounts).reduce((a, b) =>
      moodCounts[a] > moodCounts[b] ? a : b
    );

    return moods.find(mood => mood.name === mostFrequentMoodName) || null;
  }, [moods]);

  return (
    <div className="p-8 md:p-10 space-y-10">
      <div className="bg-card border-none rounded-3xl p-10 shadow-lg text-center relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <h2 className="text-4xl font-black text-foreground mb-4 font-headline tracking-tight relative z-10">
          How are you feeling today?
        </h2>
        <p className="text-muted-foreground mb-12 text-lg relative z-10">
          Select the emotion that best describes your current state.
        </p>

        <div className="flex items-center justify-center relative z-10">
          <MoodDial />
        </div>
      </div>
      
      <MoodHistory />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SummaryCard icon={Clock} title="Recent Mood" colorClass="bg-primary">
          {recentMood ? (
            <div className="flex items-center gap-4 mt-2">
              <p className="text-5xl bg-primary/10 p-4 rounded-2xl">{recentMood.emoji}</p>
              <div>
                <p className="text-2xl font-bold text-foreground">{recentMood.name}</p>
                <p className="text-sm text-primary font-medium">Today</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 mt-2">
              <p className="text-5xl bg-primary/10 p-4 rounded-2xl">🤔</p>
              <div>
                <p className="text-2xl font-bold text-foreground">No Mood</p>
                <p className="text-sm text-primary font-medium">Log your mood!</p>
              </div>
            </div>
          )}
        </SummaryCard>
        <SummaryCard icon={Flame} title="Streak" colorClass="bg-secondary">
          <div className="mt-2 flex flex-col items-start justify-center h-[88px]">
            <p className="text-6xl font-black text-foreground">{moods.length}</p>
            <p className="text-sm text-secondary font-medium">Days logged</p>
          </div>
        </SummaryCard>
        <SummaryCard icon={Heart} title="Average Mood" colorClass="bg-accent">
          {averageMood ? (
            <div className="flex items-center gap-4 mt-2">
              <p className="text-5xl bg-accent/10 p-4 rounded-2xl">{averageMood.emoji}</p>
              <div>
                <p className="text-2xl font-bold text-foreground">{averageMood.name}</p>
                <p className="text-sm text-accent font-medium">This month</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 mt-2">
              <p className="text-5xl bg-accent/10 p-4 rounded-2xl">🤔</p>
              <div>
                <p className="text-2xl font-bold text-foreground">No Data</p>
                <p className="text-sm text-accent font-medium">This month</p>
              </div>
            </div>
          )}
        </SummaryCard>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomePageContent />
    </AuthGuard>
  );
}
