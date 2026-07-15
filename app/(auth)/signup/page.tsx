'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';

export default function SignupPage() {
  const { signup, isLoading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const passwordChecks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Passwords match', met: password === confirmPassword && confirmPassword.length > 0 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the terms.');
      return;
    }

    try {
      await signup(firstName, lastName, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Create your account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Start managing your portfolio in minutes
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-[12px] text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="mb-1.5 block text-[12px] font-semibold text-foreground">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Talha"
              className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1.5 block text-[12px] font-semibold text-foreground">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="X"
              className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1.5 block text-[12px] font-semibold text-foreground">
            Work Email
          </label>
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-1.5 block text-[12px] font-semibold text-foreground">
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
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

        <div>
          <label htmlFor="confirm-password" className="mb-1.5 block text-[12px] font-semibold text-foreground">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Password strength checks */}
        {password.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {passwordChecks.map((check) => (
              <div key={check.label} className="flex items-center gap-2">
                <div className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${check.met ? 'bg-emerald-500' : 'bg-muted'}`}>
                  {check.met && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <span className={`text-[11px] ${check.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-start gap-2 pt-1">
          <input
            id="terms"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 rounded border-border accent-primary"
          />
          <label htmlFor="terms" className="text-[11px] text-muted-foreground leading-relaxed cursor-pointer">
            I agree to the{' '}
            <span className="font-semibold text-primary">Terms of Service</span> and{' '}
            <span className="font-semibold text-primary">Privacy Policy</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !agreed}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/35 hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create Account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-[12px] text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
          Sign in
        </Link>
      </p>
    </>
  );
}
