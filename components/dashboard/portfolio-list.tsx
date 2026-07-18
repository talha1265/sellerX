'use client';

import { Building2, ShoppingBag, Globe, CheckCircle2 } from 'lucide-react';
import { useAmazon } from '@/context/amazon-context';
import { formatDate } from '@/lib/utils';

export function PortfolioList() {
  const { accounts } = useAmazon();

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/15 to-pink-500/15 border border-purple-500/20">
            <Building2 className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-base font-bold">Portfolio Assets</h3>
            <p className="text-[11px] text-muted-foreground">
              {accounts.length} asset{accounts.length !== 1 ? 's' : ''} connected
            </p>
          </div>
        </div>
      </div>

      {accounts.length > 0 ? (
        <div className="divide-y divide-border/30">
          {accounts.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary border border-border">
                  <Globe className="h-4.5 w-4.5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{acc.storeName}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    ID: {acc.sellerId.slice(0, 8).toUpperCase()}... • Marketplace: {acc.marketplace}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Connected
                  </span>
                  <p className="text-[9px] text-muted-foreground mt-1">
                    Connected: {formatDate(acc.connectedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border mb-4">
            <Building2 className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1">No Portfolio Assets</p>
          <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed mb-4">
            Your acquired brands and trading accounts will appear here once you connect your Amazon Seller accounts.
          </p>
          <a
            href="/amazon"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-[11px] font-bold text-white shadow-md shadow-amber-500/15 hover:brightness-105 transition-all"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Connect Amazon Account
          </a>
        </div>
      )}
    </div>
  );
}
