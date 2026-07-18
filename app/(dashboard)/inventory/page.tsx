'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Info, AlertTriangle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useAmazon } from '@/context/amazon-context';
import { cn } from '@/lib/utils';

interface InventoryItem {
  sku: string;
  brand: string;
  itemName: string;
  inStock: number;
  reorderPoint: number;
  estRunout: string;
  status: string;
}

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { accounts } = useAmazon();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch('/api/inventory');
        if (res.ok) {
          const data = await res.json();
          setInventory(data || []);
        }
      } catch (err) {
        console.error('Failed to load inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    if (accounts.length > 0) {
      fetchInventory();
    } else {
      setInventory([]);
      setLoading(false);
    }
  }, [accounts]);

  const hasData = accounts.length > 0;

  const filtered = inventory.filter(
    (item) =>
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> In Stock
          </span>
        );
      case 'Low Stock':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-3 w-3" /> Low Stock
          </span>
        );
      case 'Out of Stock':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
            <XCircle className="h-3 w-3" /> Out of Stock
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
            {status}
          </span>
        );
    }
  };

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
          disabled={!hasData}
          className="h-9 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-xs outline-none transition-all focus:border-primary/40 focus:ring-1 focus:ring-primary/20 disabled:opacity-55"
        />
      </div>

      {/* Table Section */}
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
            {hasData && filtered.length > 0 && (
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.sku}
                    className="border-b border-border/20 last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-mono text-[11px] font-bold text-foreground">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {item.brand}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {item.itemName}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-foreground">
                      {item.inStock.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-muted-foreground">
                      {item.reorderPoint.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">
                      {item.estRunout}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-t border-border/30">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground mt-2">Loading SKU operations...</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-t border-border/30">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border mb-4">
              <Package className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-bold text-foreground mb-1">No Inventory Data</p>
            <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
              SKU inventory will populate here once your Amazon accounts are connected and synced.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-t border-border/30">
            <p className="text-xs font-bold text-foreground mb-1">No SKU matches</p>
            <p className="text-[10px] text-muted-foreground">No inventory items matched your search query.</p>
          </div>
        ) : null}
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
