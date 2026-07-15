'use client';

import {
  Plus,
  Upload,
  Zap,
  Send,
  FileText,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';

const actions = [
  { label: 'Add Brand', icon: Plus, color: '#6366f1', desc: 'Onboard a new FBA brand' },
  { label: 'Import CSV', icon: Upload, color: '#10B981', desc: 'Bulk import inventory' },
  { label: 'Run AI Scan', icon: Zap, color: '#F59E0B', desc: 'Analyze all listings' },
  { label: 'Sync Data', icon: RefreshCw, color: '#06B6D4', desc: 'Pull latest from APIs' },
  { label: 'Send Report', icon: Send, color: '#8B5CF6', desc: 'Email weekly summary' },
  { label: 'Generate P&L', icon: FileText, color: '#EC4899', desc: 'Build financial report' },
];

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 border border-violet-500/20">
            <Zap className="h-4 w-4 text-violet-500" />
          </div>
          <div>
            <h3 className="text-base font-bold">Quick Actions</h3>
            <p className="text-[11px] text-muted-foreground">Frequent operations at your fingertips</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((action) => (
          <button
            key={action.label}
            className="group flex items-center gap-3 rounded-xl border border-transparent bg-secondary/30 p-3 text-left transition-all duration-200 hover:border-border hover:bg-secondary/60 hover:shadow-sm active:scale-[0.98]"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105"
              style={{ backgroundColor: `${action.color}10`, border: `1px solid ${action.color}18` }}
            >
              <action.icon className="h-4 w-4" style={{ color: action.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-foreground truncate">{action.label}</p>
              <p className="text-[10px] text-muted-foreground truncate">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
