'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { useAuth } from './auth-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const moodData = [
  { name: 'Very Unpleasant', emoji: '😠', color: 'hsl(0, 84%, 60%)' },
  { name: 'Unpleasant', emoji: '😟', color: 'hsl(30, 84%, 60%)' },
  { name: 'Slightly Unpleasant', emoji: '😕', color: 'hsl(60, 84%, 60%)' },
  { name: 'Neutral', emoji: '😐', color: 'hsl(240, 5%, 65%)' },
  { name: 'Slightly Pleasant', emoji: '🙂', color: 'hsl(120, 60%, 65%)' },
  { name: 'Pleasant', emoji: '😊', color: 'hsl(140, 60%, 60%)' },
  { name: 'Very Pleasant', emoji: '😄', color: 'hsl(160, 80%, 60%)' },
];

export type Mood = {
  name: string;
  emoji: string;
  date: Date;
};

type MoodContextType = {
  moods: Mood[];
  addMood: (mood: Omit<Mood, 'date'>) => Promise<void>;
  clearMoods: () => Promise<void>;
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [moods, setMoods] = useState<Mood[]>([]);
  const { user, getToken } = useAuth();

  // Load moods from backend when user logs in
  useEffect(() => {
    if (!user) {
      setMoods([]);
      return;
    }

    const fetchMoods = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch(`${API_URL}/api/mood`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data: Array<{ name: string; emoji: string; date: string }> =
          await res.json();
        setMoods(
          data.map((m) => ({
            name: m.name,
            emoji: m.emoji,
            date: new Date(m.date),
          }))
        );
      } catch (error) {
        console.error('Failed to fetch moods:', error);
      }
    };

    fetchMoods();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addMood = useCallback(
    async (mood: Omit<Mood, 'date'>) => {
      // Optimistic update — add to UI immediately
      const newMood = { ...mood, date: new Date() };
      setMoods((prev) => [newMood, ...prev]);

      try {
        const token = getToken();
        if (!token) return;

        await fetch(`${API_URL}/api/mood`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: mood.name, emoji: mood.emoji }),
        });
      } catch (error) {
        console.error('Failed to save mood:', error);
        // Revert optimistic update on failure
        setMoods((prev) => prev.filter((m) => m !== newMood));
      }
    },
    [getToken]
  );

  const clearMoods = useCallback(async () => {
    const previousMoods = moods;
    setMoods([]); // Optimistic clear

    try {
      const token = getToken();
      if (!token) return;

      await fetch(`${API_URL}/api/mood`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Failed to clear moods:', error);
      setMoods(previousMoods); // Revert on failure
    }
  }, [moods, getToken]);

  const value = useMemo(
    () => ({ moods, addMood, clearMoods }),
    [moods, addMood, clearMoods]
  );

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}
