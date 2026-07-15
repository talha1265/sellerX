'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for simulated auth
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'talha@sellerx.io': {
    password: 'demo1234',
    user: {
      id: '1',
      email: 'talha@sellerx.io',
      firstName: 'Talha',
      lastName: 'X',
      role: 'Portfolio Manager',
    },
  },
  'admin@sellerx.io': {
    password: 'admin1234',
    user: {
      id: '2',
      email: 'admin@sellerx.io',
      firstName: 'Admin',
      lastName: 'User',
      role: 'Administrator',
    },
  },
};

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('sellerx-token');
    const savedUser = localStorage.getItem('sellerx-user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('sellerx-token');
        localStorage.removeItem('sellerx-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await delay(800); // Simulate API call

    const entry = DEMO_USERS[email.toLowerCase()];
    if (!entry || entry.password !== password) {
      setIsLoading(false);
      throw new Error('Invalid email or password. Try talha@sellerx.io / demo1234');
    }

    const fakeToken = `sx_${btoa(email)}_${Date.now()}`;
    setUser(entry.user);
    setToken(fakeToken);
    localStorage.setItem('sellerx-token', fakeToken);
    localStorage.setItem('sellerx-user', JSON.stringify(entry.user));
    setIsLoading(false);
    router.push('/');
  }, [router]);

  const signup = useCallback(async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true);
    await delay(1000); // Simulate API call

    if (DEMO_USERS[email.toLowerCase()]) {
      setIsLoading(false);
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      email: email.toLowerCase(),
      firstName,
      lastName,
      role: 'Portfolio Manager',
    };

    const fakeToken = `sx_${btoa(email)}_${Date.now()}`;
    setUser(newUser);
    setToken(fakeToken);
    localStorage.setItem('sellerx-token', fakeToken);
    localStorage.setItem('sellerx-user', JSON.stringify(newUser));
    setIsLoading(false);
    router.push('/');
  }, [router]);

  const forgotPassword = useCallback(async (email: string) => {
    await delay(1000);
    // In production, this would send a reset email
    // For demo purposes, just resolve successfully
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sellerx-token');
    localStorage.removeItem('sellerx-user');
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        signup,
        forgotPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
