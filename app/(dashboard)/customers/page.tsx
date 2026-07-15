'use client';

import { useState } from 'react';
import { Search, Users, Info } from 'lucide-react';

export default function CustomersPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Customers & <span className="gradient-text">Segments</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor aggregate audience lifetime value (LTV), segment splits, and emails.
        </p>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
        <input
          type="text"
          placeholder="Filter customers by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-xs outline-none transition-all focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                <th className="pb-3 px-5 pt-4">Name</th>
                <th className="pb-3 px-4 pt-4">Email</th>
                <th className="pb-3 px-4 pt-4">Segment</th>
                <th className="pb-3 px-4 pt-4 text-right">Orders</th>
                <th className="pb-3 px-4 pt-4 text-right">Total Spent</th>
                <th className="pb-3 px-4 pt-4">Location</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center border-t border-border/30">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border mb-4">
            <Users className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1">No Customer Records</p>
          <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
            Customer data will populate here from your connected Amazon accounts and direct-to-consumer channels.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/20 p-4">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Customer data is aggregated from Amazon Buyer reports and Shopify customer exports. Connect your integrations to start tracking LTV and segment performance.
        </p>
      </div>
    </div>
  );
}
