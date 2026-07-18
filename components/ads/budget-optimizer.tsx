'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

interface BudgetAllocation {
  campaign: string;
  currentBudget: number;
  aiBudget: number;
  currentAcos: number;
  projectedAcos: number;
}

const allocations: BudgetAllocation[] = [
  { campaign: 'AeroGlow Serum — Brand', currentBudget: 2850, aiBudget: 3400, currentAcos: 20.0, projectedAcos: 17.2 },
  { campaign: 'VoltGear Pro — Conquest', currentBudget: 3060, aiBudget: 2500, currentAcos: 28.6, projectedAcos: 24.1 },
  { campaign: 'PureNest Organic — Cat.', currentBudget: 4425, aiBudget: 3600, currentAcos: 28.6, projectedAcos: 22.8 },
  { campaign: 'AeroGlow Eye Cream', currentBudget: 1070, aiBudget: 500, currentAcos: 50.0, projectedAcos: 42.0 },
  { campaign: 'VoltGear Charger — SD', currentBudget: 1440, aiBudget: 2845, currentAcos: 18.2, projectedAcos: 15.6 },
];

const totalCurrent = allocations.reduce((s, a) => s + a.currentBudget, 0);
const totalAI = allocations.reduce((s, a) => s + a.aiBudget, 0);

export function BudgetOptimizer() {
  const [applied, setApplied] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold">AI Budget Optimizer</h3>
            <p className="text-[10px] text-muted-foreground">
              Projected savings: <span className="font-bold text-emerald-500">$1,140/mo</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => setApplied(!applied)}
          disabled={applied}
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-4 py-2 text-[11px] font-bold transition-all cursor-pointer',
            applied
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-primary text-white hover:brightness-105 shadow-lg shadow-primary/20',
          )}
        >
          {applied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Applied
            </>
          ) : (
            <>
              Apply AI Budget <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Total budget summary */}
        <div className="flex items-center justify-between text-[11px]">
          <div>
            <span className="text-muted-foreground">Current Total: </span>
            <span className="font-bold text-foreground">${totalCurrent.toLocaleString()}</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40" />
          <div>
            <span className="text-muted-foreground">AI Optimized: </span>
            <span className="font-bold text-primary">${totalAI.toLocaleString()}</span>
          </div>
        </div>

        {/* Budget bars */}
        <div className="space-y-4">
          {allocations.map((alloc) => {
            const maxBudget = Math.max(alloc.currentBudget, alloc.aiBudget);
            const currentPct = (alloc.currentBudget / maxBudget) * 100;
            const aiPct = (alloc.aiBudget / maxBudget) * 100;
            const diff = alloc.aiBudget - alloc.currentBudget;
            const isIncrease = diff > 0;

            return (
              <div key={alloc.campaign} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-foreground">{alloc.campaign}</p>
                  <span
                    className={cn(
                      'text-[10px] font-bold',
                      isIncrease
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-blue-600 dark:text-blue-400',
                    )}
                  >
                    {isIncrease ? '+' : ''}${diff.toLocaleString()}
                  </span>
                </div>

                {/* Current */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-muted-foreground w-10 shrink-0">Now</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentPct}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-muted-foreground/30"
                    />
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground w-14 text-right shrink-0">
                    ${alloc.currentBudget.toLocaleString()}
                  </span>
                </div>

                {/* AI Recommended */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-primary w-10 shrink-0">AI</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${aiPct}%` }}
                      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                  <span className="text-[9px] font-bold text-primary w-14 text-right shrink-0">
                    ${alloc.aiBudget.toLocaleString()}
                  </span>
                </div>

                {/* ACoS projection */}
                <div className="flex items-center gap-1 pl-12 text-[9px]">
                  <span className="text-muted-foreground">ACoS:</span>
                  <span className="text-muted-foreground">{alloc.currentAcos}%</span>
                  <ArrowRight className="h-2.5 w-2.5 text-muted-foreground/40" />
                  <span className="font-bold text-emerald-500">{alloc.projectedAcos}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
