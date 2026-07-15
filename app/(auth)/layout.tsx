import { Sparkles } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/5 blur-[80px]" />
      </div>

      {/* Dot pattern */}
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-30" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/25">
            <Sparkles className="h-6 w-6 text-white" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 blur-lg animate-glow-pulse" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            <span className="gradient-text">Seller</span>
            <span className="text-foreground">X</span>
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">Portfolio & Trading OS</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl glass glass-border">
          {children}
        </div>
      </div>
    </div>
  );
}
