'use client';

import { useRouter } from 'next/navigation';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
} from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  getToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mw_user');
    const storedToken = localStorage.getItem('mw_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('mw_user');
        localStorage.removeItem('mw_token');
      }
    }
    setIsLoading(false);
  }, []);

  const getToken = (): string | null => {
    return localStorage.getItem('mw_token');
  };

  const login = async (email: string, password: string): Promise<void> => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed. Please try again.');
    }

    localStorage.setItem('mw_token', data.token);
    localStorage.setItem('mw_user', JSON.stringify(data.user));
    setUser(data.user);
    router.push('/home');
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Registration failed. Please try again.');
    }

    localStorage.setItem('mw_token', data.token);
    localStorage.setItem('mw_user', JSON.stringify(data.user));
    setUser(data.user);
    router.push('/home');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mw_token');
    localStorage.removeItem('mw_user');
    router.push('/login');
  };

  const value = useMemo(
    () => ({ user, isLoading, login, logout, register, getToken }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
