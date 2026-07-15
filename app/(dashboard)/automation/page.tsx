'use client';

import { useState } from 'react';
import { Zap, Plus, Info } from 'lucide-react';

export default function AutomationPage() {
  const [rules, setRules] = useState<{ id: string; name: string; type: string; desc: string; active: boolean }[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Automation <span className="gradient-text">Engine</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Define triggers and execution scripts to run portfolio updates autonomously.
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-lg shadow-primary/20 hover:brightness-105 transition-all cursor-pointer">
          <Plus className="h-4 w-4" /> Add Rule
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary border border-border mb-5">
            <Zap className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1">No Automation Rules</p>
          <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed mb-5">
            Create automation rules to trigger repricing, inventory reorders, ad budget shifts, and trading hedges automatically.
          </p>
          <button className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/20 hover:brightness-105 transition-all cursor-pointer">
            <Plus className="h-4 w-4" /> Create Your First Rule
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between gap-4 card-hover">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${rule.active ? 'bg-primary/10 border border-primary/15' : 'bg-secondary'}`}>
                  <Zap className={`h-4 w-4 ${rule.active ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{rule.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{rule.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/20 p-4">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Automation rules execute server-side and require an active backend connection. Rules created here will be stored locally until a backend is wired.
        </p>
      </div>
    </div>
  );
}
