'use client';

import { TrendingUp, Info, Play } from 'lucide-react';
import { useState } from 'react';

export default function TradingPage() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Live <span className="gradient-text">Trading</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Algorithmic execution systems, futures contracts, and options hedging.
          </p>
        </div>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer ${
            isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          {isRunning ? 'Stop Execution' : 'Start Execution'}
        </button>
      </div>

      {/* Status cards — execution mode only, no fake P&L */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Execution Mode</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`relative flex h-2.5 w-2.5 ${isRunning ? 'animate-pulse' : ''}`}>
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-secondary'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRunning ? 'bg-emerald-500' : 'bg-border'}`} />
            </span>
            <p className="text-sm font-bold text-foreground">{isRunning ? 'Live Autopilot' : 'Paused'}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Daily P&L</p>
          <p className="text-lg font-black text-muted-foreground/40 mt-1">—</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Open Positions</p>
          <p className="text-lg font-black text-muted-foreground/40 mt-1">—</p>
        </div>
      </div>

      {/* Empty positions table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-bold">Active Open Positions</h3>
          <span className="text-[11px] font-bold text-muted-foreground/40">No positions</span>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border mb-4">
            <TrendingUp className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1">No Open Positions</p>
          <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
            Active positions will appear here once your algorithmic trading system is connected to a live brokerage.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/20 p-4">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Live trading data (P&L, positions, execution logs) requires a connected brokerage integration such as Alpaca or Interactive Brokers. Configure this under <strong>Integrations</strong>.
        </p>
      </div>
    </div>
  );
}
