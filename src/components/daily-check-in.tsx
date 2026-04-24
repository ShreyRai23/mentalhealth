'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Sun, Moon, Sparkles, Flame, RefreshCw } from 'lucide-react';
import { useMood } from '@/context/mood-context';
import { getAiDailyQuestion } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

const moodOptions = [
  { emoji: '😠', label: 'Very Unpleasant' },
  { emoji: '😟', label: 'Unpleasant' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😊', label: 'Pleasant' },
  { emoji: '😄', label: 'Very Pleasant' },
];

export default function DailyCheckIn() {
  const { addMood } = useMood();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [sleepHours, setSleepHours] = useState([8]);
  const [journalEntry, setJournalEntry] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [streak, setStreak] = useState(0);

  const [aiQuestion, setAiQuestion] = useState<string | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);

  const fetchQuestion = useCallback(async () => {
    setIsLoadingQuestion(true);
    setAiQuestion(null);
    const { question } = await getAiDailyQuestion();
    setAiQuestion(question);
    setIsLoadingQuestion(false);
  }, []);

  useEffect(() => {
    // Load initial streak from local storage
    const savedStreak = localStorage.getItem('mindquest_streak');
    setStreak(savedStreak ? parseInt(savedStreak, 10) : 0);
    // Fetch initial question
    fetchQuestion();
  }, [fetchQuestion]);

  const resetForm = useCallback(() => {
    setSelectedMood(null);
    setSleepHours([8]);
    setJournalEntry('');
    setSubmitted(false);
    fetchQuestion();
  }, [fetchQuestion]);

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        variant: 'destructive',
        title: 'Please select a mood.',
        description: 'Your mood is required for the daily check-in.',
      });
      return;
    }
    
    const selectedMoodObj = moodOptions.find(m => m.label === selectedMood);
    if(selectedMoodObj) {
      addMood({name: selectedMoodObj.label, emoji: selectedMoodObj.emoji});
    }

    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('mindquest_streak', newStreak.toString());

    setSubmitted(true);
    toast({
      title: 'Check-In Complete!',
      description: `Your streak is now ${newStreak}. Keep it up!`,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-4 mb-8">
        <Flame className="w-10 h-10 text-destructive" />
        <div>
          <p className="text-4xl font-bold text-foreground">{streak}</p>
          <p className="text-sm text-muted-foreground">Day Streak</p>
        </div>
      </div>
      
      {submitted ? (
        <Card className="text-center bg-card/80 animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">
              Check-In Logged!
            </CardTitle>
            <CardDescription>
              Great job on maintaining your focus. Ready for another round?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={resetForm}>
                <RefreshCw className="mr-2" /> Start New Check-In
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full bg-card/80">
          <CardHeader>
            <CardTitle className="font-headline">Your Status</CardTitle>
            <CardDescription>
              How are you feeling today? This helps shape your adventure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Mood Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">1. How is your mood?</Label>
              <RadioGroup
                value={selectedMood ?? undefined}
                onValueChange={setSelectedMood}
                className="flex flex-wrap justify-center gap-2 pt-2"
              >
                {moodOptions.map(({ emoji, label }) => (
                  <div key={label} className="flex flex-col items-center">
                    <RadioGroupItem
                      value={label}
                      id={label}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={label}
                      className={cn(
                        'flex flex-col items-center justify-center p-3 rounded-lg border-2 border-transparent cursor-pointer transition-all duration-200 w-24 h-24',
                        selectedMood === label
                          ? 'bg-primary/20 border-primary'
                          : 'bg-secondary/50 hover:bg-secondary'
                      )}
                    >
                      <span className="text-4xl">{emoji}</span>
                      <span className="text-xs mt-2 text-center text-muted-foreground">{label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Sleep Tracker */}
            <div className="space-y-4">
              <Label htmlFor="sleep-slider" className="text-lg font-medium">
                2. How much did you sleep last night?
              </Label>
              <div className="flex items-center gap-4 pt-2">
                <Moon className="text-muted-foreground" />
                <Slider
                  id="sleep-slider"
                  min={0}
                  max={16}
                  step={0.5}
                  value={sleepHours}
                  onValueChange={setSleepHours}
                />
                <Sun className="text-muted-foreground" />
              </div>
              <p className="text-center text-lg font-bold text-primary">
                {sleepHours[0]} hours
              </p>
            </div>

            {/* AI-Generated Question */}
            <div className="space-y-4">
              {isLoadingQuestion ? (
                <>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                </>
              ) : (
                <>
                  <Label htmlFor="ai-question" className="text-lg font-medium flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" /> 3. {aiQuestion}
                  </Label>
                  <Textarea
                    id="ai-question"
                    placeholder="Take a moment to reflect..."
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    className="bg-background"
                  />
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="w-full" size="lg">
              Complete Check-In & Continue Streak
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
