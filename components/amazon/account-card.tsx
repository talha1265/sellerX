'use client';

import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, Trash2, ShoppingBag, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { AmazonAccount, useAmazon } from '@/context/amazon-context';
import { cn } from '@/lib/utils';

interface Props {
  account: AmazonAccount;
  onManage: () => void;
}

export function AccountCard({ account, onManage }: Props) {
  const { disconnectAccount, syncAccount, syncingIds } = useAmazon();
  const [showConfirm, setShowConfirm] = useState(false);
  const isSyncing = syncingIds.includes(account.id);

  const lastSyncLabel = account.lastSync
    ? (() => {
        const diff = Date.now() - new Date(account.lastSync).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        return `${Math.floor(mins / 60)}h ago`;
      })()
    : null;

  const StatusIcon = account.status === 'active' ? CheckCircle : AlertCircle;
  const statusColor = account.status === 'active' ? 'text-emerald-500' : account.status === 'warning' ? 'text-amber-500' : 'text-red-500';
  const statusBg = account.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="relative rounded-2xl border border-border bg-card overflow-hidden card-hover"
    >
      {/* Header */}
      <div className="relative p-5 pb-4">
        <div className="absolute inset-0 opacity-[0.04]" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' }} />
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-500/20">
              <ShoppingBag className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-foreground leading-tight">{account.storeName}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{account.marketplace} · {account.region}</p>
            </div>
          </div>
          <div className={cn('flex items-center gap-1 rounded-full border px-2.5 py-1', statusBg)}>
            <StatusIcon className={cn('h-3 w-3', statusColor)} />
            <span className={cn('text-[9px] font-bold uppercase tracking-wider capitalize', statusColor)}>
              {account.status}
            </span>
          </div>
        </div>
      </div>

      {/* Awaiting data message */}
      <div className="px-5 py-4 border-t border-border/50">
        <div className="flex items-center gap-2 rounded-xl bg-secondary/30 border border-border/50 px-3 py-2.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-muted-foreground">
              {account.lastSync ? 'Data synced' : 'Awaiting first sync'}
            </p>
            <p className="text-[9px] text-muted-foreground/70">
              {account.lastSync
                ? `Last synced ${lastSyncLabel} · Click sync to refresh`
                : 'Click Sync Now to fetch your live account data'}
            </p>
          </div>
        </div>
      </div>

      {/* Seller ID row */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">Seller ID</span>
          <span className="font-mono font-bold">{account.sellerId.slice(0, 8).toUpperCase()}…</span>
        </div>
        <div className="flex items-center justify-between text-[10px] mt-1.5">
          <span className="text-muted-foreground">Connected</span>
          <span className="font-medium">{new Date(account.connectedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/50 px-5 py-3">
        <div className="flex items-center gap-1.5">
          <div className={cn('h-1.5 w-1.5 rounded-full', isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500')} />
          <span className="text-[9px] text-muted-foreground font-medium">
            {isSyncing ? 'Syncing…' : account.lastSync ? `Synced ${lastSyncLabel}` : 'Never synced'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => syncAccount(account.id)}
            disabled={isSyncing}
            className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSyncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            Sync Now
          </button>
          <button
            onClick={onManage}
            className="flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1.5 text-[10px] font-bold text-primary hover:bg-primary/20 transition-all cursor-pointer"
          >
            <ExternalLink className="h-3 w-3" />
            Manage
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="rounded-lg border border-red-500/20 px-2.5 py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Disconnect confirm overlay */}
      {showConfirm && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-card/96 backdrop-blur-sm p-6 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
          <p className="text-sm font-bold mb-1">Disconnect Account?</p>
          <p className="text-[11px] text-muted-foreground mb-4">
            This will remove <span className="font-semibold text-foreground">{account.storeName}</span> from SellerX.
          </p>
          <div className="flex gap-2">
            <button onClick={() => disconnectAccount(account.id)} className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer">
              Disconnect
            </button>
            <button onClick={() => setShowConfirm(false)} className="rounded-xl border border-border px-4 py-2 text-xs font-bold hover:bg-secondary transition-colors cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
