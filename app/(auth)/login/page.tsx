'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Welcome back</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your portfolio dashboard
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-[12px] text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[12px] font-semibold text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="talha@sellerx.io"
            className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-[12px] font-semibold text-foreground">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 pr-10 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-border accent-primary"
          />
          <label htmlFor="remember" className="text-[12px] text-muted-foreground cursor-pointer">
            Remember me for 30 days
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/35 hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo credentials hint */}
      <div className="mt-5 rounded-xl border border-dashed border-border/80 bg-secondary/20 p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">Demo Credentials</p>
        <p className="text-[11px] text-muted-foreground font-mono">
          talha@sellerx.io / demo1234
        </p>
      </div>

      <p className="mt-5 text-center text-[12px] text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors">
          Create one
        </Link>
      </p>
    </>
  );
}
