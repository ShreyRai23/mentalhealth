'use client';
import { type Mood, moodData } from '@/context/mood-context';

const moodColors: { [key: string]: string } = moodData.reduce(
  (acc: { [key: string]: string }, mood) => {
    acc[mood.name] = mood.color;
    return acc;
  },
  {}
);

const DailyMood = ({ mood }: { mood: Mood | null }) => {
  const color = mood ? moodColors[mood.name] : 'hsl(var(--muted))';

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 30px 8px ${color}33, 0 0 15px 4px ${color}55`,
        }}
      />
      {/* Outer Ring */}
      <div className="absolute inset-0 border-2 border-white/10 rounded-full" />
      {/* Middle Ring */}
      <div className="absolute inset-2 border border-white/20 rounded-full" />
      {/* Inner Ring */}
      <div className="absolute inset-4 border border-white/30 rounded-full" />

      {mood ? (
        <div className="relative text-7xl">{mood.emoji}</div>
      ) : (
        <>
          {/* Inner Orb for when no mood is logged */}
          <div
            className="absolute w-16 h-16 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color} 0%, ${color}aa 70%)`,
            }}
          />
          {/* Center Dot for when no mood is logged */}
          <div className="absolute w-2 h-2 rounded-full bg-black/50" />
        </>
      )}
    </div>
  );
};

export default DailyMood;
