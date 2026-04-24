'use client';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMood, moodData } from '@/context/mood-context';

const DIAL_RADIUS = 140;
const HANDLE_SIZE = 32;
const LABEL_RADIUS = DIAL_RADIUS + 50;

const MoodDial = () => {
  const dialRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const { addMood } = useMood();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Start at Neutral
    const neutralIndex = moodData.findIndex(m => m.name === 'Neutral');
    const step = (Math.PI * 2) / moodData.length;
    const initialAngle = -Math.PI / 2 + neutralIndex * step;
    setAngle(initialAngle);
  }, []);

  const selectedMood = useMemo(() => {
    const numMoods = moodData.length;
    const step = (2 * Math.PI) / numMoods;
    // Normalize angle to be positive
    let normalizedAngle = (angle + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
    let moodIndex = Math.round(normalizedAngle / step) % numMoods;
    return moodData[moodIndex];
  }, [angle]);

  const bind = useDrag(({ xy }) => {
    if (dialRef.current) {
      const { left, top, width, height } =
        dialRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const newAngle = Math.atan2(xy[1] - centerY, xy[0] - centerX);
      setAngle(newAngle);
    }
  });

  const handleLogMood = () => {
    if (selectedMood) {
      addMood({ name: selectedMood.name, emoji: selectedMood.emoji });
      toast({
        title: 'Mood Logged!',
        description: `You're feeling: ${selectedMood.name} ${selectedMood.emoji}`,
      });
      router.push(
        `/mood-details?mood=${encodeURIComponent(
          selectedMood.name
        )}&emoji=${encodeURIComponent(selectedMood.emoji)}`
      );
    }
  };

  const handleX = DIAL_RADIUS * Math.cos(angle);
  const handleY = DIAL_RADIUS * Math.sin(angle);

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        ref={dialRef}
        className="relative w-[380px] h-[380px] rounded-full flex items-center justify-center cursor-pointer"
        {...bind()}
        style={{ touchAction: 'none' }}
      >
        <div className="absolute w-full h-full border-8 border-card rounded-full shadow-inner bg-background/80 backdrop-blur-xl" />

        {moodData.map((mood, index) => {
          const numMoods = moodData.length;
          const moodAngle = -Math.PI / 2 + (index / numMoods) * (2 * Math.PI);
          const labelX = LABEL_RADIUS * Math.cos(moodAngle);
          const labelY = LABEL_RADIUS * Math.sin(moodAngle);
          const isSelected = selectedMood?.name === mood.name;

          return (
            <div
              key={mood.name}
              className="absolute w-24 h-10 flex items-center justify-center"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              }}
            >
              <span
                className={cn(
                  'text-4xl transition-all duration-300 text-center',
                  isSelected ? 'scale-125' : 'opacity-50 scale-90'
                )}
              >
                {mood.emoji}
              </span>
            </div>
          );
        })}

        <div className="absolute w-[140px] h-[140px] bg-card/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg">
          <span
            className="text-7xl transition-transform duration-300 ease-in-out"
            style={{ transform: `scale(${selectedMood ? 1 : 0.5})` }}
          >
            {selectedMood?.emoji}
          </span>
        </div>

        {/* Handle */}
        <div
          className="absolute rounded-full border-4 border-background/80 shadow-lg transition-colors"
          style={{
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            transform: `translate(-50%, -50%) translate(${handleX}px, ${handleY}px)`,
            left: '50%',
            top: '50%',
            backgroundColor: selectedMood?.color || 'hsl(var(--primary))',
          }}
        />
      </div>

      <div className="h-20 flex flex-col items-center justify-center text-center">
        {selectedMood && (
          <>
            <p
              className="text-3xl font-bold transition-colors"
              style={{ color: selectedMood.color }}
            >
              {selectedMood.name}
            </p>
            <p className="text-muted-foreground mt-1">
              You have selected a mood.
            </p>
          </>
        )}
      </div>

      <Button
        disabled={!selectedMood}
        size="lg"
        onClick={handleLogMood}
        className="transition-colors rounded-full px-12 text-lg shadow-lg shadow-primary/20"
      >
        Log Mood
      </Button>
    </div>
  );
};

export default MoodDial;
