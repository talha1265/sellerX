'use client';

import { Brain, ShoppingBag } from 'lucide-react';

export function AIInsightsPanel() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Brain className="h-4 w-4 text-white" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 blur-md animate-glow-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold">AI Agent Insights</h3>
            <p className="text-[10px] text-muted-foreground font-medium">Atlas CEO v2.4 • 0 active</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 bg-secondary px-2.5 py-1 rounded-full border border-border">
          Standby
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border mb-4">
          <Brain className="h-6 w-6 text-muted-foreground/40" />
        </div>
        <p className="text-sm font-bold text-foreground mb-1">No Insights Available</p>
        <p className="text-[11px] text-muted-foreground max-w-[200px] leading-relaxed mb-4">
          Atlas will generate real-time recommendations once your Amazon accounts are connected and synced.
        </p>
        <a
          href="/amazon"
          className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Connect Account
        </a>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 py-2.5 text-[11px] font-bold text-muted-foreground transition-all hover:border-primary/40 hover:text-primary hover:bg-primary/5 cursor-pointer">
        <Brain className="h-3.5 w-3.5" />
        Launch Agent Terminal
      </button>
    </div>
  );
}
