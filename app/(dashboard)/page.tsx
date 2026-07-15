'use client';

import { motion } from 'framer-motion';
import { KPICard } from '@/components/dashboard/kpi-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { PortfolioList } from '@/components/dashboard/portfolio-list';
import { AIInsightsPanel } from '@/components/dashboard/ai-insights';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { QuickActions } from '@/components/dashboard/quick-actions';
import {
  DollarSign,
  TrendingUp,
  Building2,
  Zap,
  Package,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const kpis = [
  {
    label: 'Portfolio Valuation',
    value: 0,
    change: 0,
    changeType: 'neutral' as const,
    format: 'currency' as const,
    icon: DollarSign,
    color: '#6366F1',
  },
  {
    label: 'Monthly Revenue',
    value: 0,
    change: 0,
    changeType: 'neutral' as const,
    format: 'currency' as const,
    icon: TrendingUp,
    color: '#10B981',
  },
  {
    label: 'Acquired Brands',
    value: 0,
    change: 0,
    changeType: 'neutral' as const,
    format: 'number' as const,
    icon: Building2,
    color: '#8B5CF6',
  },
  {
    label: 'Live Algo Systems',
    value: 0,
    change: 0,
    changeType: 'neutral' as const,
    format: 'number' as const,
    icon: Zap,
    color: '#F59E0B',
  },
  {
    label: 'Active Listings',
    value: 0,
    change: 0,
    changeType: 'neutral' as const,
    format: 'number' as const,
    icon: Package,
    color: '#06B6D4',
  },
  {
    label: 'Portfolio Health',
    value: 0,
    change: 0,
    changeType: 'neutral' as const,
    format: 'percentage' as const,
    icon: ShieldCheck,
    color: '#14B8A6',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function Home() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* ─── Header Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-muted-foreground/30 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-muted-foreground/40" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              Atlas v2.4 — Awaiting Data
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Portfolio <span className="gradient-text">Command</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg">
            Connect your Amazon accounts and integrations to start monitoring your portfolio in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="/amazon"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-[12px] font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:brightness-105 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Connect Amazon
          </a>
        </div>
      </motion.div>

      {/* ─── KPI Metrics ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6"
      >
        {kpis.map((kpi) => (
          <motion.div key={kpi.label} variants={itemVariants}>
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Charts + AI Insights ─── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="xl:col-span-2"
        >
          <RevenueChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <AIInsightsPanel />
        </motion.div>
      </div>

      {/* ─── Portfolio Table ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <PortfolioList />
      </motion.div>

      {/* ─── Activity + Quick Actions ─── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="xl:col-span-2"
        >
          <ActivityFeed />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <QuickActions />
        </motion.div>
      </div>
    </div>
  );
}
