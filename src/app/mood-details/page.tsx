'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Info, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const feelings = [
  'Content',
  'Calm',
  'Peaceful',
  'Indifferent',
  'Drained',
  'Hopeful',
  'Stressed',
  'Anxious',
  'Overwhelmed',
];

const FeelingButton = ({
  feeling,
  isSelected,
  onSelect,
}: {
  feeling: string;
  isSelected: boolean;
  onSelect: (feeling: string) => void;
}) => (
  <Button
    variant="outline"
    onClick={() => onSelect(feeling)}
    className={cn(
      'rounded-full border-2 text-base h-auto py-2 px-6',
      isSelected
        ? 'bg-primary/20 border-primary text-primary-foreground'
        : 'bg-secondary/50 border-secondary text-muted-foreground'
    )}
  >
    {feeling}
  </Button>
);

function MoodDetailsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mood = searchParams.get('mood') || 'Neutral';
  const emoji = searchParams.get('emoji') || '😐';

  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings(prev =>
      prev.includes(feeling)
        ? prev.filter(f => f !== feeling)
        : [...prev, feeling]
    );
  };

  const handleNext = () => {
    const params = new URLSearchParams(searchParams);
    params.set('feelings', selectedFeelings.join(','));
    router.push(`/mood-impact?${params.toString()}`);
  };

  const displayedFeelings = showMore ? feelings : feelings.slice(0, 5);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Mood
        </Button>
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
          <Link href="/home">Cancel</Link>
        </Button>
      </header>
      <main className="flex-1 flex flex-col items-center px-4 pt-8">
        <div className="relative flex items-center justify-center w-48 h-48">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 bg-primary/20 rounded-full animate-pulse [animation-delay:0.2s]"></div>
          <div className="relative text-8xl">{emoji}</div>
        </div>

        <h1 className="text-4xl font-bold mt-6">{mood}</h1>

        <div className="w-full max-w-md mt-12">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-medium text-muted-foreground">
              What best describes this feeling?
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground/50" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select one or more feelings that apply.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-wrap gap-3">
            {displayedFeelings.map(feeling => (
              <FeelingButton
                key={feeling}
                feeling={feeling}
                isSelected={selectedFeelings.includes(feeling)}
                onSelect={toggleFeeling}
              />
            ))}
          </div>

          {!showMore && feelings.length > 5 && (
            <Button
              variant="link"
              onClick={() => setShowMore(true)}
              className="text-primary mt-4 px-0"
            >
              Show More >
            </Button>
          )}
        </div>
      </main>

      <footer className="p-4 text-center border-t border-border/10">
        <Button
          size="lg"
          className="bg-primary text-primary-foreground text-lg rounded-full px-12 shadow-lg shadow-primary/20"
          onClick={handleNext}
        >
          Next
          <ArrowRight />
        </Button>
      </footer>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </header>
      <main className="flex-1 flex flex-col items-center px-4 pt-8">
        <Skeleton className="w-48 h-48 rounded-full" />
        <Skeleton className="h-10 w-40 mt-6" />
        <div className="w-full max-w-md mt-12 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-20 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
      </main>
      <footer className="p-4 text-center border-t border-border/10">
        <Skeleton className="h-12 w-40 rounded-full mx-auto" />
      </footer>
    </div>
  );
}

export default function MoodDetailsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MoodDetailsPageContent />
    </Suspense>
  );
}
