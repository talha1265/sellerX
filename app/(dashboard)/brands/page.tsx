'use client';

import { motion } from 'framer-motion';
import { Building2, Plus, Info } from 'lucide-react';

export default function BrandsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            FBA <span className="gradient-text">Brands</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage, evaluate, and scale your acquired e-commerce portfolios.
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:brightness-105 cursor-pointer">
          <Plus className="h-4 w-4" /> Add Brand
        </button>
      </div>

      {/* Empty state */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <Building2 className="h-10 w-10 text-indigo-400" />
          </div>
          <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-lg">
            <Plus className="h-3.5 w-3.5" />
          </div>
        </div>
        <h2 className="text-xl font-black mb-2">No Brands Added Yet</h2>
        <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
          Add your first Amazon FBA brand to start tracking valuations, monthly sales, health scores, and growth metrics.
        </p>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:brightness-105 transition-all cursor-pointer">
          <Plus className="h-4 w-4" /> Add Your First Brand
        </button>

        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-border bg-secondary/20 p-4 max-w-md text-left">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Brand data is sourced directly from your connected Amazon accounts. Connect an account via the <strong>Amazon</strong> page to automatically populate your brand portfolio.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
