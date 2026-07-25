'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Loader2, AlertCircle, ShoppingBag, Eye, EyeOff, Shield } from 'lucide-react';
import { useAmazon, ConnectCredentials } from '@/context/amazon-context';

/* ─── Marketplace options ─── */
const MARKETPLACES = [
  { label: 'United States', code: 'ATVPDKIKX0DER', domain: 'amazon.com', region: 'North America', flag: '🇺🇸' },
  { label: 'Canada', code: 'A2EUQ1WTGCTBG2', domain: 'amazon.ca', region: 'North America', flag: '🇨🇦' },
  { label: 'Mexico', code: 'A1AM78C64UM0Y8', domain: 'amazon.com.mx', region: 'North America', flag: '🇲🇽' },
  { label: 'United Kingdom', code: 'A1F83G8C2ARO7P', domain: 'amazon.co.uk', region: 'Europe', flag: '🇬🇧' },
  { label: 'Germany', code: 'A1PA6795UKMFR9', domain: 'amazon.de', region: 'Europe', flag: '🇩🇪' },
  { label: 'France', code: 'A13V1IB3VIYZZH', domain: 'amazon.fr', region: 'Europe', flag: '🇫🇷' },
  { label: 'Italy', code: 'APJ6JRA9NG5V4', domain: 'amazon.it', region: 'Europe', flag: '🇮🇹' },
  { label: 'Spain', code: 'A1RKKUPIHCS9HS', domain: 'amazon.es', region: 'Europe', flag: '🇪🇸' },
  { label: 'Japan', code: 'A1VC38T7YXB528', domain: 'amazon.co.jp', region: 'Far East', flag: '🇯🇵' },
  { label: 'Australia', code: 'A39IBJ37TRP1C6', domain: 'amazon.com.au', region: 'Far East', flag: '🇦🇺' },
  { label: 'India', code: 'A21TJRUUN4KGV', domain: 'amazon.in', region: 'Far East', flag: '🇮🇳' },
  { label: 'UAE', code: 'A2VIGQ35RCS4UG', domain: 'amazon.ae', region: 'Middle East', flag: '🇦🇪' },
];

interface Props {
  onClose: () => void;
}

export function ConnectWizard({ onClose }: Props) {
  const { connectAccount } = useAmazon();
  const [step, setStep] = useState(1);
  const [selectedMarketplace, setSelectedMarketplace] = useState<typeof MARKETPLACES[0] | null>(null);
  const [sellerId, setSellerId] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [connectedStoreName, setConnectedStoreName] = useState('');

  const canProceedStep2 = !!selectedMarketplace;
  const canProceedStep3 = sellerId.trim().length >= 6 && clientId.trim().length >= 10 && clientSecret.trim().length >= 10;

  const handleVerify = async () => {
    if (!selectedMarketplace) return;
    setIsVerifying(true);
    setVerifyError('');
    try {
      const credentials: ConnectCredentials = {
        sellerId: sellerId.trim(),
        clientId: clientId.trim(),
        clientSecret: clientSecret.trim(),
        marketplace: selectedMarketplace.domain,
        marketplaceCode: selectedMarketplace.code,
        region: selectedMarketplace.region,
      };
      const account = await connectAccount(credentials);
      setConnectedStoreName(account.storeName);
      setStep(4);
    } catch {
      setVerifyError('Connection failed. Please verify your credentials and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative flex items-center gap-3 p-5 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-500/20">
            <ShoppingBag className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Connect Amazon Account</h2>
            <p className="text-[10px] text-muted-foreground">SP-API OAuth 2.0 Secure Connection</p>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                  step > s ? 'bg-emerald-500 text-white' : step === s ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'
                }`}>
                  {step > s ? <Check className="h-3 w-3" /> : s}
                </div>
                {s < 4 && (
                  <div className={`h-px flex-1 transition-all duration-500 ${step > s ? 'bg-emerald-500' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mb-1">
            {['Marketplace', 'Credentials', 'Verify', 'Done'].map((label, i) => (
              <span key={label} className={`text-[9px] font-bold uppercase tracking-wider ${step === i + 1 ? 'text-primary' : step > i + 1 ? 'text-emerald-500' : 'text-muted-foreground/50'}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="p-5 min-h-[320px]">
          <AnimatePresence mode="wait">
            {/* Step 1 — Instant OAuth Login or Select Marketplace */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h3 className="text-sm font-bold mb-1">Connect Your Amazon Account</h3>
                <p className="text-[11px] text-muted-foreground mb-4">
                  Log in directly with Amazon to grant permissions automatically, or select a marketplace to configure manually.
                </p>

                {/* Main Instant OAuth Buttons */}
                <div className="mb-5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-5 text-center shadow-lg shadow-amber-500/5">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-sm font-black text-foreground mb-1">Recommended: 1-Click Connect</h4>
                  <p className="text-[11px] text-muted-foreground mb-4 max-w-xs mx-auto">
                    Connect your Amazon account instantly or authenticate via Amazon LWA portal.
                  </p>
                  <div className="space-y-2">
                    <a
                      href="/api/auth/amazon/login?direct=true"
                      className="inline-flex items-center justify-center gap-2.5 w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <span className="text-base">⚡</span> Instant 1-Click Connect
                    </a>
                    <a
                      href="/api/auth/amazon/login"
                      className="inline-flex items-center justify-center gap-2.5 w-full rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
                    >
                      <span>🔑</span> Official Amazon LWA OAuth Portal
                    </a>
                  </div>
                </div>


                <div className="relative my-4 flex items-center justify-center">
                  <div className="border-t border-border w-full"></div>
                  <span className="bg-card px-3 text-[9px] font-bold uppercase text-muted-foreground shrink-0">Or choose marketplace for manual entry</span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {MARKETPLACES.map((m) => (
                    <button
                      key={m.code}
                      onClick={() => setSelectedMarketplace(m)}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                        selectedMarketplace?.code === m.code
                          ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                          : 'border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/60'
                      }`}
                    >
                      <span className="text-lg">{m.flag}</span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold truncate">{m.label}</p>
                        <p className="text-[9px] text-muted-foreground truncate">{m.domain}</p>
                      </div>
                      {selectedMarketplace?.code === m.code && (
                        <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}


            {/* Step 2 — Credentials */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h3 className="text-sm font-bold mb-1">SP-API Credentials</h3>
                <p className="text-[11px] text-muted-foreground mb-4">
                  Enter your Seller Central SP-API credentials. Find these under{' '}
                  <span className="text-primary font-semibold">Apps &amp; Services → Manage Your Apps</span>.
                </p>
                {/* Direct OAuth Login Button */}
                <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center">
                  <p className="text-[11px] font-bold text-foreground mb-2">Fastest Option: Connect using Login with Amazon (LWA)</p>
                  <a
                    href="/api/auth/amazon/login"
                    className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:brightness-105 transition-all cursor-pointer"
                  >
                    <span>🔑</span> Login with Amazon OAuth
                  </a>
                </div>

                <div className="relative my-4 flex items-center justify-center">
                  <div className="border-t border-border w-full"></div>
                  <span className="bg-card px-2 text-[9px] font-bold uppercase text-muted-foreground shrink-0">Or enter credentials manually</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">Seller ID</label>

                    <input
                      type="text"
                      value={sellerId}
                      onChange={(e) => setSellerId(e.target.value)}
                      placeholder="e.g. A2EUQ1WTGCTBG2X"
                      className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-xs font-mono outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">Client ID (LWA App ID)</label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="amzn1.application-oa2-client.xxxx"
                      className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-xs font-mono outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">Client Secret</label>
                    <div className="relative">
                      <input
                        type={showSecret ? 'text' : 'password'}
                        value={clientSecret}
                        onChange={(e) => setClientSecret(e.target.value)}
                        placeholder="amzn1.oa2-cs.v1.xxxx"
                        className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 pr-10 text-xs font-mono outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/10 p-3">
                  <Shield className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Credentials are stored locally and never transmitted to third-party servers. Connection uses Amazon's official OAuth 2.0 LWA protocol.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Verify */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="flex flex-col items-center justify-center h-full py-8">
                {isVerifying ? (
                  <div className="text-center">
                    <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                      <div className="absolute inset-1 rounded-full border-2 border-primary/30" />
                      <Loader2 className="h-7 w-7 text-primary animate-spin" />
                    </div>
                    <h3 className="text-sm font-bold mb-2">Verifying Connection</h3>
                    <p className="text-[11px] text-muted-foreground">Authenticating with Amazon SP-API…</p>
                    <div className="mt-4 space-y-1.5 text-left max-w-xs mx-auto">
                      {['Initiating LWA token exchange', 'Verifying seller permissions', 'Fetching account metadata'].map((step, i) => (
                        <div key={step} className="flex items-center gap-2">
                          <Loader2 className="h-3 w-3 text-primary/60 animate-spin shrink-0" style={{ animationDelay: `${i * 0.2}s` }} />
                          <span className="text-[10px] text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : verifyError ? (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                      <AlertCircle className="h-7 w-7 text-red-500" />
                    </div>
                    <h3 className="text-sm font-bold mb-2 text-red-500">Connection Failed</h3>
                    <p className="text-[11px] text-muted-foreground mb-4">{verifyError}</p>
                    <button
                      onClick={() => { setVerifyError(''); setStep(2); }}
                      className="rounded-xl border border-border px-4 py-2 text-xs font-bold hover:bg-secondary transition-colors cursor-pointer"
                    >
                      Back to Credentials
                    </button>
                  </div>
                ) : (
                  <div className="text-center w-full">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
                      <ShoppingBag className="h-7 w-7 text-amber-500" />
                    </div>
                    <h3 className="text-sm font-bold mb-1">Ready to Connect</h3>
                    <p className="text-[11px] text-muted-foreground mb-5">Review your connection details before proceeding.</p>
                    <div className="rounded-xl border border-border bg-secondary/30 p-4 text-left space-y-2 mb-2">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase">Marketplace</span>
                        <span className="text-[11px] font-bold">{selectedMarketplace?.flag} {selectedMarketplace?.label} ({selectedMarketplace?.domain})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase">Seller ID</span>
                        <span className="text-[11px] font-mono">{sellerId.slice(0, 8)}…</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase">Region</span>
                        <span className="text-[11px] font-bold">{selectedMarketplace?.region}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4 — Done */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="flex flex-col items-center justify-center py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20"
                >
                  <Check className="h-8 w-8 text-emerald-500" />
                </motion.div>
                <h3 className="text-base font-black mb-1.5">Account Connected!</h3>
                <p className="text-[12px] text-muted-foreground mb-2">
                  <span className="font-bold text-foreground">{connectedStoreName}</span> is now syncing with SellerX.
                </p>
                <p className="text-[11px] text-muted-foreground mb-6">
                  Real-time metrics, listings data, and advertising analytics are now available in your Amazon dashboard.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:brightness-105 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                  >
                    View Dashboard
                  </button>
                  <button
                    onClick={() => { setStep(1); setSelectedMarketplace(null); setSellerId(''); setClientId(''); setClientSecret(''); }}
                    className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-bold hover:bg-secondary transition-colors cursor-pointer"
                  >
                    Add Another
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        {step < 4 && !isVerifying && (
          <div className="flex items-center justify-between border-t border-border px-5 py-4">
            <button
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-bold transition-all hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Back
            </button>

            {step < 3 && (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !canProceedStep2 : !canProceedStep3}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-lg shadow-primary/20 hover:brightness-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Continue <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}

            {step === 3 && !verifyError && (
              <button
                onClick={handleVerify}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/20 hover:brightness-105 transition-all cursor-pointer"
              >
                Verify &amp; Connect <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
