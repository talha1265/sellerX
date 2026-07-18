'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  MinusCircle,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Target,
  Ban,
  Wallet,
  Loader2,
} from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'bid_adjust' | 'negative_keyword' | 'budget_shift';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  direction: 'up' | 'down' | 'neutral';
  campaign: string;
}

const typeConfig = {
  bid_adjust: { icon: Target, label: 'Bid Adjustment', color: 'text-indigo-500' },
  negative_keyword: { icon: Ban, label: 'Negative Keyword', color: 'text-rose-500' },
  budget_shift: { icon: Wallet, label: 'Budget Reallocation', color: 'text-amber-500' },
};

export function AIRecommendations() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/ads/campaigns');
        if (res.ok) {
          const data = await res.json();
          setRecs(data.recommendations || []);
        }
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleAccept = (id: string) => {
    setAccepted((prev) => [...prev, id]);
    setTimeout(() => setRecs((prev) => prev.filter((r) => r.id !== id)), 400);
  };

  const handleDismiss = (id: string) => {
    setDismissed((prev) => [...prev, id]);
    setTimeout(() => setRecs((prev) => prev.filter((r) => r.id !== id)), 400);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/60" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Brain className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold">AI Recommendations</h3>
            <p className="text-[10px] text-muted-foreground">
              {recs.length} action{recs.length !== 1 ? 's' : ''} pending
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          Live Analysis
        </span>
      </div>

      <div className="p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {recs.map((rec) => {
            const config = typeConfig[rec.type];
            const TypeIcon = config.icon;
            const isAccepted = accepted.includes(rec.id);
            const isDismissed = dismissed.includes(rec.id);

            return (
              <motion.div
                key={rec.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{
                  opacity: isAccepted || isDismissed ? 0 : 1,
                  y: 0,
                  scale: isAccepted || isDismissed ? 0.95 : 1,
                }}
                exit={{ opacity: 0, scale: 0.9, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        rec.type === 'bid_adjust' && 'bg-indigo-500/10 border border-indigo-500/15',
                        rec.type === 'negative_keyword' && 'bg-rose-500/10 border border-rose-500/15',
                        rec.type === 'budget_shift' && 'bg-amber-500/10 border border-amber-500/15',
                      )}
                    >
                      <TypeIcon className={cn('h-4 w-4', config.color)} />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-foreground">{rec.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{config.label} • {rec.campaign}</p>
                    </div>
                  </div>
                  {/* Confidence */}
                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary/50" />
                      <span className="text-[11px] font-bold text-foreground">{rec.confidence}%</span>
                    </div>
                    <div className="w-14 h-1 rounded-full bg-border mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                        style={{ width: `${rec.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-muted-foreground leading-relaxed pl-[42px]">
                  {rec.description}
                </p>

                {/* Impact + Actions */}
                <div className="flex items-center justify-between pl-[42px]">
                  <span
                    className={cn(
                      'flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold',
                      rec.direction === 'up'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : rec.direction === 'down'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {rec.direction === 'up' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : rec.direction === 'down' ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <MinusCircle className="h-3 w-3" />
                    )}
                    {rec.impact}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDismiss(rec.id)}
                      className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[10px] font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all cursor-pointer"
                    >
                      <X className="h-3 w-3" /> Dismiss
                    </button>
                    <button
                      onClick={() => handleAccept(rec.id)}
                      className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-white hover:brightness-105 transition-all cursor-pointer"
                    >
                      <Check className="h-3 w-3" /> Accept
                      <ArrowRight className="h-3 w-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {recs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/15 mb-3">
              <Check className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-foreground">All Caught Up!</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              No pending AI recommendations. Check back in a few hours.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
