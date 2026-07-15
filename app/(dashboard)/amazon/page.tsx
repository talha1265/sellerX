'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Plus, Package, BarChart3, Activity, Info,
  RefreshCw, Loader2, ArrowUpRight,
} from 'lucide-react';
import { useAmazon, AmazonAccount } from '@/context/amazon-context';
import { AccountCard } from '@/components/amazon/account-card';
import { ConnectWizard } from '@/components/amazon/connect-wizard';

/* ─── Empty Tab State ─── */
function EmptyTabState({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border mb-4">
        <Icon className="h-6 w-6 text-muted-foreground/50" />
      </div>
      <p className="text-sm font-bold text-foreground mb-1">{title}</p>
      <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab({ account }: { account: AmazonAccount }) {
  const { syncAccount, syncingIds } = useAmazon();
  const isSyncing = syncingIds.includes(account.id);

  if (!account.lastSync) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-5">
          <RefreshCw className="h-7 w-7 text-amber-500" />
        </div>
        <h3 className="text-sm font-bold mb-2">No Data Yet</h3>
        <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed mb-6">
          Sync your account to pull live revenue, order counts, listing metrics, and advertising performance from Amazon Seller Central.
        </p>
        <button
          onClick={() => syncAccount(account.id)}
          disabled={isSyncing}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-white hover:brightness-105 transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-amber-500/20"
        >
          {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {isSyncing ? 'Syncing…' : 'Sync Now'}
        </button>
        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Live data requires a connected SP-API backend. Sync stores the last-updated timestamp.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border mb-4">
        <BarChart3 className="h-6 w-6 text-muted-foreground/50" />
      </div>
      <p className="text-sm font-bold text-foreground mb-1">Ready for SP-API Backend</p>
      <p className="text-[11px] text-muted-foreground max-w-sm leading-relaxed">
        Your account is connected. Wire a real SP-API backend to stream live revenue, orders, and listing data here.
      </p>
      <div className="mt-6 flex items-center gap-2 text-[10px] text-muted-foreground bg-secondary/50 border border-border rounded-xl px-4 py-2.5">
        <Info className="h-3.5 w-3.5 shrink-0" />
        Last synced: {new Date(account.lastSync).toLocaleString()}
      </div>
    </div>
  );
}

/* ─── Generic empty tab ─── */
function EmptyDataTab({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <EmptyTabState
      icon={Icon}
      title={`No ${title} Data`}
      description={`${title} data will appear here once you connect a real Amazon SP-API backend and sync your account.`}
    />
  );
}

/* ─── Tabs ─── */
const TABS = ['Overview', 'Listings', 'Advertising', 'Health'] as const;
type Tab = typeof TABS[number];

const TAB_ICONS: Record<Tab, React.ElementType> = {
  Overview: BarChart3,
  Listings: Package,
  Advertising: Activity,
  Health: ShoppingBag,
};

/* ─── Main Page ─── */
export default function AmazonPage() {
  const { accounts } = useAmazon();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const selectedAccount: AmazonAccount | null =
    accounts.find((a) => a.id === selectedAccountId) ?? accounts[0] ?? null;

  return (
    <>
      <div className="space-y-6">
        {/* ─── Header ─── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-500/20">
                <ShoppingBag className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-500">Amazon Seller Central</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Amazon <span className="gradient-text">Account Manager</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Connect your Amazon Seller accounts and manage them from one place.
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-500/20 hover:brightness-105 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Connect Account
          </button>
        </div>

        {/* ─── Account Cards ─── */}
        {accounts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {accounts.map((account) => (
                  <div key={account.id} className="relative">
                    <AccountCard account={account} onManage={() => setSelectedAccountId(account.id)} />
                    {selectedAccount?.id === account.id && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-primary" />
                    )}
                  </div>
                ))}
              </AnimatePresence>
            </div>

            {/* ─── Detail Panel ─── */}
            {selectedAccount && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                {/* Panel header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400/20 to-orange-500/20">
                      <ShoppingBag className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black">{selectedAccount.storeName}</h2>
                      <p className="text-[10px] text-muted-foreground">
                        {selectedAccount.marketplace} · Seller ID: {selectedAccount.sellerId.slice(0, 8).toUpperCase()}…
                      </p>
                    </div>
                  </div>
                  <div className="flex rounded-xl border border-border bg-secondary/30 p-1 gap-1">
                    {TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer ${
                          activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5">
                  <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      {activeTab === 'Overview' && <OverviewTab account={selectedAccount} />}
                      {activeTab === 'Listings' && <EmptyDataTab title="Listings" icon={Package} />}
                      {activeTab === 'Advertising' && <EmptyDataTab title="Advertising" icon={Activity} />}
                      {activeTab === 'Health' && <EmptyDataTab title="Account Health" icon={Activity} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* SP-API info banner */}
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/20 p-4">
              <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-foreground mb-0.5">Backend Integration Required</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Live metrics (revenue, orders, listings, advertising, account health) require a server-side SP-API backend. 
                  Your credentials are stored securely. Wire the backend to unlock full data streaming.
                </p>
              </div>
            </div>
          </>
        ) : (
          /* ─── Empty State ─── */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="relative mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-500/20">
                <ShoppingBag className="h-10 w-10 text-amber-500" />
              </div>
              <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                <Plus className="h-3.5 w-3.5" />
              </div>
            </div>
            <h2 className="text-xl font-black mb-2">No Amazon Accounts Connected</h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
              Connect your Amazon Seller Central account via SP-API to start managing your listings, inventory, and advertising campaigns from SellerX.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:brightness-105 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Connect Amazon Account
            </button>

            <div className="mt-10 grid grid-cols-3 gap-4 text-center max-w-md">
              {[
                { icon: Package, label: 'Listings & Inventory' },
                { icon: BarChart3, label: 'Advertising Analytics' },
                { icon: Activity, label: 'Account Health' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-xl border border-border bg-card p-4">
                  <Icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showWizard && <ConnectWizard onClose={() => setShowWizard(false)} />}
      </AnimatePresence>
    </>
  );
}
