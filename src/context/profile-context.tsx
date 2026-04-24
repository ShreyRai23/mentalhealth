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

// Define the shape of the profile data
export type ProfileData = {
  name: string;
  age: number;
  gender: string;
  country: string;
  sleepHours: number;
  interests: string[];
  stressors: string[];
};

type ProfileContextType = {
  profileData: ProfileData;
  setProfileData: (profileData: ProfileData) => Promise<void>;
  resetProfile: () => Promise<void>;
};

const defaultProfileData: ProfileData = {
  name: '',
  age: 0,
  gender: 'Prefer not to say',
  country: '',
  sleepHours: 8,
  interests: [],
  stressors: [],
};

// Create the context with a default value
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Define the provider component
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileData, setProfileDataState] =
    useState<ProfileData>(defaultProfileData);
  const { user, getToken } = useAuth();

  // Load profile from backend when user logs in
  useEffect(() => {
    if (!user) {
      setProfileDataState(defaultProfileData);
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data: ProfileData & { userId?: string; __v?: number; _id?: string } =
          await res.json();

        setProfileDataState({
          name: data.name || user.name || '',
          age: data.age || 0,
          gender: data.gender || 'Prefer not to say',
          country: data.country || '',
          sleepHours: data.sleepHours || 8,
          interests: data.interests || [],
          stressors: data.stressors || [],
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const setProfileData = useCallback(
    async (newData: ProfileData): Promise<void> => {
      setProfileDataState(newData); // Optimistic update

      try {
        const token = getToken();
        if (!token) return;

        await fetch(`${API_URL}/api/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newData),
        });
      } catch (error) {
        console.error('Failed to save profile:', error);
      }
    },
    [getToken]
  );

  const resetProfile = useCallback(async (): Promise<void> => {
    const resetData: ProfileData = {
      name: '',
      age: 0,
      gender: 'Prefer not to say',
      country: '',
      sleepHours: 8,
      interests: [],
      stressors: [],
    };

    setProfileDataState(resetData); // Optimistic update

    try {
      const token = getToken();
      if (!token) return;

      await fetch(`${API_URL}/api/profile`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Failed to reset profile:', error);
    }
  }, [getToken]);

  const value = useMemo(
    () => ({ profileData, setProfileData, resetProfile }),
    [profileData, setProfileData, resetProfile]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

// Create a custom hook for using the context
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
