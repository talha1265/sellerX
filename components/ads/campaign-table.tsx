'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import {
  ArrowUpDown,
  Pause,
  Play,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused';
  matchType: 'Exact' | 'Phrase' | 'Broad' | 'Auto';
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  sales: number;
  acos: number;
  roas: number;
  aiHealth: number;
  spendTrend: number[];
}

type SortField = 'spend' | 'sales' | 'acos' | 'roas' | 'aiHealth';

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 48;
  const h = 20;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = 2 + (h - 4) - ((v - min) / range) * (h - 4);
    return { x, y };
  });
  let path = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const cp1x = points[i].x + (points[i + 1].x - points[i].x) / 3;
    const cp2x = points[i + 1].x - (points[i + 1].x - points[i].x) / 3;
    path += ` C${cp1x},${points[i].y} ${cp2x},${points[i + 1].y} ${points[i + 1].x},${points[i + 1].y}`;
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-60">
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HealthBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      : score >= 50
        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
        : 'bg-red-500/10 text-red-600 dark:text-red-400';
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-bold', color)}>
        {score}
      </div>
      <Sparkles className="h-3 w-3 text-primary/40" />
    </div>
  );
}

export function CampaignTable() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('roas');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const { token } = useAuth();

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/ads/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'paused') => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      const res = await fetch('/api/ads/campaigns', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ campaignId: id, status: nextStatus }),
      });
      if (res.ok) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const sorted = [...campaigns].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    return (a[sortField] - b[sortField]) * mul;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const cols: { label: string; field: SortField }[] = [
    { label: 'Spend', field: 'spend' },
    { label: 'Sales', field: 'sales' },
    { label: 'ACoS', field: 'acos' },
    { label: 'ROAS', field: 'roas' },
    { label: 'AI Score', field: 'aiHealth' },
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/60" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-bold">Campaign Performance</h3>
        <span className="text-[10px] font-bold text-muted-foreground">
          {campaigns.length} campaigns
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Campaign
              </th>
              <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Trend
              </th>
              {cols.map((col) => (
                <th
                  key={col.field}
                  onClick={() => toggleSort(col.field)}
                  className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown
                      className={cn(
                        'h-3 w-3 transition-colors',
                        sortField === col.field ? 'text-primary' : 'text-muted-foreground/30',
                      )}
                    />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <tr
                key={c.id}
                className="border-b border-border/20 last:border-0 hover:bg-secondary/30 transition-colors"
              >
                <td className="px-5 py-3.5">
                  <div>
                    <p className="text-[12px] font-bold text-foreground">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {c.matchType} • {(c.impressions / 1000).toFixed(0)}K imp • {c.clicks.toLocaleString()} clicks • {c.ctr}% CTR
                    </p>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <button
                    onClick={() => handleToggleStatus(c.id, c.status)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold cursor-pointer transition-all hover:brightness-105',
                      c.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {c.status === 'active' ? (
                      <Play className="h-2.5 w-2.5 fill-current" />
                    ) : (
                      <Pause className="h-2.5 w-2.5" />
                    )}
                    {c.status === 'active' ? 'Active' : 'Paused'}
                  </button>
                </td>
                <td className="px-3 py-3.5">
                  <MiniSparkline
                    data={c.spendTrend}
                    color={c.aiHealth >= 80 ? '#10b981' : c.aiHealth >= 50 ? '#f59e0b' : '#ef4444'}
                  />
                </td>
                <td className="px-3 py-3.5 text-[12px] font-semibold text-foreground">
                  ${c.spend.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </td>
                <td className="px-3 py-3.5 text-[12px] font-semibold text-foreground">
                  ${c.sales.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </td>
                <td className="px-3 py-3.5">
                  <span
                    className={cn(
                      'text-[12px] font-bold',
                      c.acos <= 20
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : c.acos <= 30
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400',
                    )}
                  >
                    {c.acos.toFixed(1)}%
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <span className="flex items-center gap-1 text-[12px] font-bold text-foreground">
                    {c.roas.toFixed(1)}x
                    {c.roas >= 4 ? (
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                    ) : c.roas >= 3 ? (
                      <Minus className="h-3 w-3 text-amber-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <HealthBadge score={c.aiHealth} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
