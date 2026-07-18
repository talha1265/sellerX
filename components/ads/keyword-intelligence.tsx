'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Search,
  TrendingUp,
  Plus,
  Crown,
  ArrowUpRight,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface TopKeyword {
  keyword: string;
  bid: number;
  position: number;
  conversions: number;
  ctr: number;
  trend: 'up' | 'down' | 'stable';
}

interface SuggestedKeyword {
  keyword: string;
  predictedRoas: number;
  searchVolume: string;
  competition: 'Low' | 'Medium' | 'High';
  suggestedBid: number;
}

export function KeywordIntelligence() {
  const [topKeywords, setTopKeywords] = useState<TopKeyword[]>([]);
  const [suggestedKeywords, setSuggestedKeywords] = useState<SuggestedKeyword[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const res = await fetch('/api/ads/campaigns');
        if (res.ok) {
          const data = await res.json();
          setTopKeywords(data.keywords?.top || []);
          setSuggestedKeywords(data.keywords?.suggested || []);
        }
      } catch (err) {
        console.error('Failed to fetch keywords:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchKeywords();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 flex items-center justify-center col-span-2">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/60" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Top Performing Keywords */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold">Top Performing Keywords</h3>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground">Last 30 days</span>
        </div>
        <div className="divide-y divide-border/30">
          {topKeywords.map((kw, idx) => (
            <div
              key={kw.keyword}
              className="flex items-center justify-between px-5 py-3 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-muted-foreground">
                  #{idx + 1}
                </span>
                <div>
                  <p className="text-[12px] font-semibold text-foreground flex items-center gap-1.5">
                    <Search className="h-3 w-3 text-muted-foreground/50" />
                    {kw.keyword}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Bid: ${kw.bid.toFixed(2)} • Pos: #{kw.position} • {kw.ctr}% CTR
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-foreground">{kw.conversions}</span>
                <span
                  className={cn(
                    'flex items-center gap-0.5 rounded px-1 text-[9px] font-bold',
                    kw.trend === 'up' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                    kw.trend === 'down' && 'bg-red-500/10 text-red-600 dark:text-red-400',
                    kw.trend === 'stable' && 'bg-muted text-muted-foreground',
                  )}
                >
                  {kw.trend === 'up' ? (
                    <TrendingUp className="h-2.5 w-2.5" />
                  ) : kw.trend === 'down' ? (
                    <ArrowUpRight className="h-2.5 w-2.5 rotate-90" />
                  ) : (
                    '—'
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Suggested Keywords */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <h3 className="text-sm font-bold">AI-Suggested Keywords</h3>
          </div>
          <span className="text-[10px] font-bold text-primary">Predicted ROAS</span>
        </div>
        <div className="divide-y divide-border/30">
          {suggestedKeywords.map((kw) => (
            <div
              key={kw.keyword}
              className="flex items-center justify-between px-5 py-3 hover:bg-secondary/30 transition-colors group"
            >
              <div>
                <p className="text-[12px] font-semibold text-foreground flex items-center gap-1.5">
                  <Search className="h-3 w-3 text-primary/50" />
                  {kw.keyword}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Vol: {kw.searchVolume} •{' '}
                  <span
                    className={cn(
                      'font-bold',
                      kw.competition === 'Low' && 'text-emerald-500',
                      kw.competition === 'Medium' && 'text-amber-500',
                      kw.competition === 'High' && 'text-red-400',
                    )}
                  >
                    {kw.competition}
                  </span>{' '}
                  • Bid: ${kw.suggestedBid?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {kw.predictedRoas?.toFixed(1) || '0.0'}x
                </span>
                <button className="flex h-6 w-6 items-center justify-center rounded-lg border border-border text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
