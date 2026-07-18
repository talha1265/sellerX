'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Wallet, Info, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useAmazon } from '@/context/amazon-context';
import { useAuth } from '@/context/auth-context';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Payout {
  payoutDate: string;
  amount: number;
  status: string;
}

interface FinanceDetails {
  totalRevenue: number;
  adSpend: number;
  aggregateCogs: number;
  netProfit: number;
  payouts: Payout[];
}

export default function FinancePage() {
  const [financeData, setFinanceData] = useState<FinanceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { accounts } = useAmazon();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setFinanceData(null);
      setLoading(false);
      return;
    }
    const fetchFinance = async () => {
      try {
        const res = await fetch('/api/finance', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setFinanceData(data.finance || null);
        }
      } catch (err) {
        console.error('Failed to load finance data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (accounts.length > 0) {
      fetchFinance();
    } else {
      setFinanceData(null);
      setLoading(false);
    }
  }, [accounts, token]);

  const hasData = accounts.length > 0;

  const statCards = [
    {
      label: 'Total Revenue',
      value: hasData && financeData ? formatCurrency(financeData.totalRevenue) : '—',
      icon: DollarSign,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
    {
      label: 'Ad Spend (PPC)',
      value: hasData && financeData ? formatCurrency(financeData.adSpend) : '—',
      icon: DollarSign,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
    },
    {
      label: 'Aggregate COGS',
      value: hasData && financeData ? formatCurrency(financeData.aggregateCogs) : '—',
      icon: Wallet,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      label: 'Net Profit',
      value: hasData && financeData ? formatCurrency(financeData.netProfit) : '—',
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
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

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color, bgColor }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 card-hover">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${bgColor} ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black mt-3 text-foreground">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Payout history */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <h3 className="text-sm font-bold">Payout History</h3>
          {hasData && financeData && (
            <span className="text-[10px] font-bold text-muted-foreground">
              {financeData.payouts.length} payouts logged
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground mt-2">Loading transactions...</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border mb-4">
              <DollarSign className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-bold text-foreground mb-1">No Payout Records</p>
            <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
              Amazon payout history will appear here once your accounts are connected and a Stripe or bank integration is configured.
            </p>
          </div>
        ) : financeData && financeData.payouts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  <th className="pb-3 px-5 pt-4">Payout Date</th>
                  <th className="pb-3 px-4 pt-4 text-right">Amount</th>
                  <th className="pb-3 px-5 pt-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {financeData.payouts.map((payout, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/20 last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-semibold text-foreground">
                      {formatDate(payout.payoutDate)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-2.5 w-2.5" /> {payout.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-xs text-muted-foreground">No payouts available.</p>
          </div>
        )}
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
