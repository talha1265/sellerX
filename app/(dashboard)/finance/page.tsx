'use client';

import { DollarSign, Wallet, Info } from 'lucide-react';

export default function FinancePage() {
  const statCards = [
    { label: 'Total Revenue', icon: DollarSign, color: 'text-indigo-500' },
    { label: 'Ad Spend (PPC)', icon: DollarSign, color: 'text-rose-500' },
    { label: 'Aggregate COGS', icon: Wallet, color: 'text-cyan-500' },
    { label: 'Net Profit', icon: DollarSign, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Finance & <span className="gradient-text">Payouts</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review net profits, aggregate COGS, ad spend overhead, and bank payouts.
        </p>
      </div>

      {/* Stat cards — empty */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5">
            <div className={`flex items-center gap-2 ${color}`}>
              <Icon className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
            </div>
            <p className="text-2xl font-black mt-2 text-muted-foreground/30">—</p>
          </div>
        ))}
      </div>

      {/* Payout history empty */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-bold">Payout History</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border mb-4">
            <DollarSign className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1">No Payout Records</p>
          <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
            Amazon payout history will appear here once your accounts are connected and a Stripe or bank integration is configured.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/20 p-4">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Financial data requires live connections to Amazon SP-API (revenue, COGS) and Stripe (payouts). Configure integrations to unlock real-time finance tracking.
        </p>
      </div>
    </div>
  );
}
