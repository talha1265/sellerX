'use client';

import { useState, useEffect } from 'react';
import { useAmazon } from '@/context/amazon-context';
import { useAuth } from '@/context/auth-context';
import { motion } from 'framer-motion';
import {
  Megaphone,
  TrendingUp,
  TrendingDown,
  Percent,
  DollarSign,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Zap,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { AIRecommendations } from '@/components/ads/ai-recommendations';
import { BudgetOptimizer } from '@/components/ads/budget-optimizer';
import { KeywordIntelligence } from '@/components/ads/keyword-intelligence';
import { CampaignTable } from '@/components/ads/campaign-table';
import { formatCurrency } from '@/lib/utils';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

type Range = '7D' | '30D' | '90D';

const kpiData: Record<Range, {
  spend: number; spendChange: number;
  sales: number; salesChange: number;
  acos: number; acosChange: number;
  roas: number; roasChange: number;
  score: number; scoreChange: number;
}> = {
  '7D': {
    spend: 12846.50, spendChange: 4.2,
    sales: 50553.30, salesChange: 12.4,
    acos: 25.4, acosChange: -2.1,
    roas: 3.94, roasChange: 8.3,
    score: 84, scoreChange: 5,
  },
  '30D': {
    spend: 54320.00, spendChange: 2.8,
    sales: 222712.00, salesChange: 10.1,
    acos: 24.4, acosChange: -3.5,
    roas: 4.10, roasChange: 7.1,
    score: 87, scoreChange: 8,
  },
  '90D': {
    spend: 168450.00, spendChange: 1.5,
    sales: 673800.00, salesChange: 8.7,
    acos: 25.0, acosChange: -1.2,
    roas: 4.00, roasChange: 6.8,
    score: 89, scoreChange: 10,
  },
};

const chartData: Record<Range, { date: string; Spend: number; Sales: number; ACoS: number }[]> = {
  '7D': [
    { date: 'Jul 10', Spend: 1550, Sales: 5800, ACoS: 26.7 },
    { date: 'Jul 11', Spend: 1820, Sales: 6900, ACoS: 26.3 },
    { date: 'Jul 12', Spend: 1450, Sales: 6200, ACoS: 23.3 },
    { date: 'Jul 13', Spend: 1980, Sales: 8100, ACoS: 24.4 },
    { date: 'Jul 14', Spend: 1640, Sales: 7100, ACoS: 23.1 },
    { date: 'Jul 15', Spend: 2100, Sales: 9300, ACoS: 22.5 },
    { date: 'Jul 16', Spend: 2306, Sales: 10153, ACoS: 22.7 },
  ],
  '30D': [
    { date: 'Wk 1', Spend: 11200, Sales: 44000, ACoS: 25.4 },
    { date: 'Wk 2', Spend: 12500, Sales: 51000, ACoS: 24.5 },
    { date: 'Wk 3', Spend: 13800, Sales: 58000, ACoS: 23.8 },
    { date: 'Wk 4', Spend: 16820, Sales: 69712, ACoS: 24.1 },
  ],
  '90D': [
    { date: 'Apr', Spend: 52100, Sales: 202000, ACoS: 25.8 },
    { date: 'May', Spend: 55400, Sales: 224000, ACoS: 24.7 },
    { date: 'Jun', Spend: 60950, Sales: 247800, ACoS: 24.6 },
  ],
};

export default function AdsOptimizerPage() {
  const [range, setRange] = useState<Range>('7D');
  const [mounted, setMounted] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [hasOptimized, setHasOptimized] = useState(false);
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { accounts } = useAmazon();
  const { token } = useAuth();

  const fetchAdsData = async () => {
    try {
      const res = await fetch('/api/ads/campaigns');
      if (res.ok) {
        const data = await res.json();
        setDbData(data);
      }
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAdsData();
  }, [accounts]);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/ads/optimize', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setHasOptimized(true);
        await fetchAdsData();
      }
    } catch (err) {
      console.error('Failed to optimize portfolio:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const hasData = accounts.length > 0;
  const campaigns = dbData?.campaigns || [];
  
  const totalSpend = hasData ? campaigns.reduce((acc: number, c: any) => acc + c.spend, 0) : 0;
  const totalSales = hasData ? campaigns.reduce((acc: number, c: any) => acc + c.sales, 0) : 0;
  
  const activeCampaigns = campaigns.filter((c: any) => c.status === 'active');
  
  const avgAcos = hasData && activeCampaigns.length > 0
    ? activeCampaigns.reduce((acc: number, c: any) => acc + c.acos, 0) / activeCampaigns.length
    : 0;
    
  const avgRoas = hasData && activeCampaigns.length > 0
    ? activeCampaigns.reduce((acc: number, c: any) => acc + c.roas, 0) / activeCampaigns.length
    : 0;
    
  const avgHealth = hasData && campaigns.length > 0
    ? Math.round(campaigns.reduce((acc: number, c: any) => acc + c.aiHealth, 0) / campaigns.length)
    : 0;

  const currentChartData = hasData 
    ? chartData[range]
    : chartData[range].map(d => ({ ...d, Spend: 0, Sales: 0, ACoS: 0 }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border bg-card p-3 shadow-xl backdrop-blur-md text-[11px]">
          <p className="font-bold text-foreground mb-1.5">{label}</p>
          <div className="space-y-1">
            {payload.map((p: any) => (
              <div key={p.name} className="flex items-center gap-4 justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}:
                </span>
                <span className="font-bold text-foreground">
                  {p.name === 'ACoS' ? `${p.value.toFixed(1)}%` : formatCurrency(p.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* ─── Header Section ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/20">
              <Megaphone className="h-3.5 w-3.5 text-indigo-500 animate-glow-pulse" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-500">AI Ads Engine</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Ads <span className="gradient-text">Optimizer</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Maximize your ROAS and scale keyword-level efficiency using machine learning automation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Range Selector */}
          <div className="flex rounded-xl border border-border bg-secondary/30 p-1 gap-1">
            {(['7D', '30D', '90D'] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer ${
                  range === r
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {hasData && (
            <button
              onClick={handleOptimize}
              disabled={isOptimizing || hasOptimized || campaigns.length === 0}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all cursor-pointer shadow-lg ${
                hasOptimized
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-none'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-105 shadow-indigo-500/25'
              }`}
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Optimizing...
                </>
              ) : hasOptimized ? (
                <>
                  <Zap className="h-3.5 w-3.5 text-emerald-500" /> Optimized
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" /> Optimize All
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ─── KPI Cards Grid ─── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {/* KPI 1: Ad Spend */}
        <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ad Spend</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-lg font-black text-foreground">{formatCurrency(totalSpend)}</h3>
          <div className="flex items-center gap-1 mt-1 text-[10px]">
            <span className="flex items-center text-emerald-500 font-bold">
              <TrendingUp className="h-3 w-3 mr-0.5" />{hasData ? '+4.2%' : '0%'}
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        </div>

        {/* KPI 2: Ad Sales */}
        <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ad Sales</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-lg font-black text-foreground">{formatCurrency(totalSales)}</h3>
          <div className="flex items-center gap-1 mt-1 text-[10px]">
            <span className="flex items-center text-emerald-500 font-bold">
              <TrendingUp className="h-3 w-3 mr-0.5" />{hasData ? '+12.4%' : '0%'}
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        </div>

        {/* KPI 3: ACoS */}
        <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">ACoS</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-lg font-black text-foreground">{avgAcos.toFixed(1)}%</h3>
          <div className="flex items-center gap-1 mt-1 text-[10px]">
            <span className="flex items-center text-emerald-500 font-bold">
              <TrendingDown className="h-3 w-3 mr-0.5" />{hasData ? '-2.1%' : '0%'}
            </span>
            <span className="text-muted-foreground">lower is better</span>
          </div>
        </div>

        {/* KPI 4: ROAS */}
        <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">ROAS</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-lg font-black text-foreground">{avgRoas.toFixed(2)}x</h3>
          <div className="flex items-center gap-1 mt-1 text-[10px]">
            <span className="flex items-center text-emerald-500 font-bold">
              <TrendingUp className="h-3 w-3 mr-0.5" />{hasData ? '+8.3%' : '0%'}
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        </div>

        {/* KPI 5: Optimization Score */}
        <div className="col-span-2 md:col-span-4 lg:col-span-1 rounded-2xl border border-border bg-card p-5 relative overflow-hidden card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI Health Score</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-500 border border-indigo-500/20">
              <Sparkles className="h-4 w-4 animate-glow-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-black text-foreground">{avgHealth}/100</h3>
          <div className="flex items-center gap-1 mt-1 text-[10px]">
            <span className="flex items-center text-emerald-500 font-bold">
              <TrendingUp className="h-3 w-3 mr-0.5" />{hasData ? '+5' : '0'} pts
            </span>
            <span className="text-muted-foreground">since optimization</span>
          </div>
        </div>
      </div>

      {/* ─── Chart Section ─── */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/20">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-base font-bold">Performance Trends</h3>
              <p className="text-[11px] text-muted-foreground">Interactive Spend, Sales, and ACoS correlations</p>
            </div>
          </div>
        </div>

        {/* Recharts Area/Bar/Line Composed Chart */}
        <div className="w-full flex items-center justify-center" style={{ height: 350 }}>
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#6b7280"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#f59e0b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  name="Ad Sales"
                  dataKey="Sales"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#salesGradient)"
                />
                <Bar
                  yAxisId="left"
                  name="Ad Spend"
                  dataKey="Spend"
                  fill="url(#spendGradient)"
                  stroke="#10b981"
                  strokeWidth={1}
                  strokeOpacity={0.3}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  name="ACoS"
                  dataKey="ACoS"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 1.5, fill: '#1f2937' }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground/30" />
            </div>
          )}
        </div>
      </div>

      {/* ─── Recommendations & Budget Optimizer Grid ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <AIRecommendations />
        </div>
        <div className="lg:col-span-5">
          <BudgetOptimizer />
        </div>
      </div>

      {/* ─── Keyword Intelligence Section ─── */}
      <KeywordIntelligence />

      {/* ─── Campaign Table Section ─── */}
      <CampaignTable />

      {/* ─── SP-API Integration Alert Banner ─── */}
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/20 p-4">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-foreground mb-0.5">Advertising API Synchronizer</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            The optimization engine runs using synced campaign data from your Amazon store. Make sure you connect your Seller account under the <a href="/amazon" className="text-primary hover:underline font-semibold">Amazon Manager</a> page to sync real campaigns.
          </p>
        </div>
      </div>
    </div>
  );
}
