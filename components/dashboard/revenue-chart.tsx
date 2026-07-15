'use client';

import { TrendingUp, ShoppingBag } from 'lucide-react';

export function RevenueChart() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/20">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-base font-bold">Portfolio Performance</h3>
            <p className="text-[11px] text-muted-foreground">Revenue, profit & active trade volume</p>
          </div>
        </div>
      </div>

      {/* Empty chart state */}
      <div className="flex flex-col items-center justify-center" style={{ height: 320 }}>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary border border-border mb-5">
          <TrendingUp className="h-7 w-7 text-muted-foreground/30" />
        </div>
        <p className="text-sm font-bold text-foreground mb-1">No Chart Data</p>
        <p className="text-[11px] text-muted-foreground max-w-xs text-center leading-relaxed mb-5">
          Revenue and profit trends will appear here once your Amazon accounts are connected and transaction data is synced.
        </p>
        <a
          href="/amazon"
          className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/15 transition-all"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Connect Amazon Account
        </a>
      </div>
    </div>
  );
}
