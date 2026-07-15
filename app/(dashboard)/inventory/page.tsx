'use client';

import { Package, Search, Info } from 'lucide-react';
import { useState } from 'react';

export default function InventoryPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Inventory <span className="gradient-text">Operations</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor SKU stocks, reorder points, restock velocities, and warehouse logistics.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
        <input
          type="text"
          placeholder="Search by SKU or item name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-xs outline-none transition-all focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
        />
      </div>

      {/* Empty table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                <th className="pb-3 px-5 pt-4">SKU</th>
                <th className="pb-3 px-4 pt-4">Brand</th>
                <th className="pb-3 px-4 pt-4">Item Name</th>
                <th className="pb-3 px-4 pt-4 text-right">In Stock</th>
                <th className="pb-3 px-4 pt-4 text-right">Reorder At</th>
                <th className="pb-3 px-4 pt-4 text-right">Est. Runout</th>
                <th className="pb-3 px-4 pt-4">Status</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center border-t border-border/30">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border mb-4">
            <Package className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1">No Inventory Data</p>
          <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
            SKU inventory will populate here once your Amazon accounts are connected and synced.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/20 p-4">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Inventory data is pulled from Amazon FBA via SP-API. Connect your seller account and sync to see live stock levels, reorder alerts, and estimated runout dates.
        </p>
      </div>
    </div>
  );
}
