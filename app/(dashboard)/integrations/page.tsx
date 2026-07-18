'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useAmazon } from '@/context/amazon-context';
import { useAuth } from '@/context/auth-context';
import { AnimatePresence } from 'framer-motion';
import { ConnectWizard } from '@/components/amazon/connect-wizard';

const OTHER_INTEGRATIONS = [
  { id: 'shopify', name: 'Shopify Store Connector', desc: 'Sync off-Amazon sales channels and direct-to-consumer catalogs.', category: 'Commerce', connected: false, logo: '🛍️' },
  { id: 'stripe', name: 'Stripe Finance API', desc: 'Pull daily customer payouts, payments processing details.', category: 'Finance', connected: true, logo: '💳' },
  { id: 'quickbooks', name: 'QuickBooks Ledger', desc: 'Sync invoice ledgers, expense logs, and tax assets.', category: 'Finance', connected: false, logo: '💼' },
  { id: 'alpaca', name: 'Alpaca Trading Brokerage', desc: 'Execute live trades on equities, futures contracts, and options.', category: 'Trading', connected: true, logo: '📊' },
];

export default function IntegrationsPage() {
  const { accounts } = useAmazon();
  const amazonConnected = accounts.length > 0;
  const [showWizard, setShowWizard] = useState(false);
  const [others, setOthers] = useState(OTHER_INTEGRATIONS);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const { token } = useAuth();

  const toggleOther = (id: string) => {
    setOthers(prev => prev.map(item => item.id === id ? { ...item, connected: !item.connected } : item));
  };

  const handleTestCredentials = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/amazon/test-credentials', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTestResult(data);
      } else {
        setTestResult({ success: false, message: 'Failed to run connection diagnostics.' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Diagnostic query failed.' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Channel <span className="gradient-text">Integrations</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Connect your store, bank ledger, or broker account to coordinate data streams.
          </p>
        </div>

        {/* Amazon SP-API — Featured Card */}
        <div className="relative rounded-2xl border overflow-hidden card-hover"
          style={{
            borderColor: amazonConnected ? 'rgba(245,158,11,0.3)' : undefined,
            background: amazonConnected
              ? 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(239,68,68,0.04) 100%)'
              : undefined,
          }}
        >
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📦</span>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-foreground">Amazon Seller Partner API</h3>
                    <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border"
                      style={amazonConnected
                        ? { background: 'rgba(16,185,129,0.1)', color: '#10b981', borderColor: 'rgba(16,185,129,0.2)' }
                        : { background: 'var(--secondary)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }
                      }>
                      {amazonConnected ? `${accounts.length} Account${accounts.length > 1 ? 's' : ''} Connected` : 'Disconnected'}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed max-w-md">
                    Sync orders, inventory, listings, and advertising analytics from your Amazon Seller Central accounts.
                  </p>
                  {amazonConnected && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {accounts.map((a) => (
                        <span key={a.id} className="rounded-lg bg-secondary/50 border border-border px-2 py-0.5 text-[9px] font-bold">
                          {a.storeName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase shrink-0">Commerce</span>
            </div>
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex flex-wrap items-center gap-3">
                {amazonConnected ? (
                  <>
                    <a
                      href="/amazon"
                      className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/15 transition-all"
                    >
                      Open Account Manager <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => setShowWizard(true)}
                      className="flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-secondary transition-all cursor-pointer"
                    >
                      + Add Account
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowWizard(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-[11px] font-bold text-white shadow-md shadow-amber-500/15 hover:brightness-105 transition-all cursor-pointer"
                  >
                    Connect Amazon Account <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                )}

                <button
                  onClick={handleTestCredentials}
                  disabled={isTesting}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary/35 px-4 py-2 text-[11px] font-bold text-foreground hover:bg-secondary transition-all disabled:opacity-50 cursor-pointer sm:ml-auto"
                >
                  {isTesting ? 'Testing Connection...' : 'Test .env API Connection'}
                </button>
              </div>

              {testResult && (
                <div className={`mt-3.5 rounded-xl border p-3.5 text-[11px] ${
                  testResult.success
                    ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300'
                    : 'border-red-500/25 bg-red-500/5 text-red-800 dark:text-red-300'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{testResult.success ? '✅' : '❌'}</span>
                    <span className="font-bold uppercase tracking-wider text-[9px]">{testResult.success ? 'LWA Authentication Valid' : 'LWA Authentication Failed'}</span>
                  </div>
                  <p className="leading-relaxed font-medium">{testResult.message}</p>
                  {testResult.success && testResult.accessToken && (
                    <div className="mt-2 font-mono text-[9px] bg-emerald-950/20 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/10 flex justify-between">
                      <span>Access Token Snapshot: {testResult.accessToken}</span>
                      <span>Expires: {testResult.expiresIn}s</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Other integrations grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between card-hover min-h-[170px]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{item.logo}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    item.connected ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {item.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{item.name}</h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{item.category}</span>
                <button
                  onClick={() => toggleOther(item.id)}
                  className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer ${
                    item.connected
                      ? 'border border-red-500/20 text-red-500 hover:bg-red-500/5'
                      : 'bg-primary text-white hover:brightness-105 shadow-md shadow-primary/10'
                  }`}
                >
                  {item.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showWizard && <ConnectWizard onClose={() => setShowWizard(false)} />}
      </AnimatePresence>
    </>
  );
}
