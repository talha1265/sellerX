'use client';

import { BarChart3, Users, ShoppingCart, Info } from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    { label: 'Traffic (Visits)', icon: Users, color: 'text-primary' },
    { label: 'Conversion Rate', icon: ShoppingCart, color: 'text-emerald-500' },
    { label: 'Average Order Value', icon: BarChart3, color: 'text-indigo-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Analytics & <span className="gradient-text">BI</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Deep-dive customer behavior analytics, funnel conversion, and top performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5">
            <div className={`flex items-center gap-2 ${color}`}>
              <Icon className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
            </div>
            <p className="text-2xl font-black mt-2 text-muted-foreground/30">—</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-bold">Conversion Funnel</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <BarChart3 className="h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-xs font-bold text-muted-foreground">No funnel data yet</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-bold">Portfolio Brand Share</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <BarChart3 className="h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-xs font-bold text-muted-foreground">No brands connected</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/20 p-4">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Analytics data is aggregated from your connected Amazon SP-API accounts. Connect and sync your accounts to unlock traffic, conversion, and revenue analytics.
        </p>
      </div>
    </div>
  );
}
