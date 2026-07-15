'use client';

import { Clock, Info, ShoppingBag } from 'lucide-react';

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 border border-cyan-500/20">
            <Clock className="h-4 w-4 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-base font-bold">Activity Feed</h3>
            <p className="text-[11px] text-muted-foreground">Real-time events across all systems</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border mb-4">
          <Clock className="h-6 w-6 text-muted-foreground/40" />
        </div>
        <p className="text-sm font-bold text-foreground mb-1">No Activity Yet</p>
        <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed mb-4">
          Live events — orders, trades, alerts, and system actions — will stream here once your integrations are connected.
        </p>
        <a
          href="/amazon"
          className="flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2 text-[11px] font-bold text-primary hover:bg-primary/20 transition-all"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Connect Amazon Account
        </a>
      </div>
    </div>
  );
}
