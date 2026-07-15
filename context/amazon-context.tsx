'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* ─── Types ─── */
export interface AmazonAccount {
  id: string;
  sellerId: string;
  storeName: string;
  marketplace: string;
  marketplaceCode: string;
  region: string;
  connectedAt: string;
  lastSync: string | null;
  status: 'active' | 'warning' | 'error';
}

export interface ConnectCredentials {
  sellerId: string;
  clientId: string;
  clientSecret: string;
  marketplace: string;
  marketplaceCode: string;
  region: string;
}

interface AmazonContextType {
  accounts: AmazonAccount[];
  isConnecting: boolean;
  syncingIds: string[];
  connectAccount: (credentials: ConnectCredentials) => Promise<AmazonAccount>;
  disconnectAccount: (accountId: string) => void;
  syncAccount: (accountId: string) => Promise<void>;
}

const AmazonContext = createContext<AmazonContextType | undefined>(undefined);

const STORAGE_KEY = 'sellerx-amazon-accounts';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MARKETPLACE_NAMES: Record<string, string> = {
  'amazon.com': 'United States',
  'amazon.ca': 'Canada',
  'amazon.com.mx': 'Mexico',
  'amazon.co.uk': 'United Kingdom',
  'amazon.de': 'Germany',
  'amazon.fr': 'France',
  'amazon.it': 'Italy',
  'amazon.es': 'Spain',
  'amazon.co.jp': 'Japan',
  'amazon.com.au': 'Australia',
  'amazon.in': 'India',
  'amazon.ae': 'UAE',
};

/* ─── Provider ─── */
export function AmazonProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<AmazonAccount[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncingIds, setSyncingIds] = useState<string[]>([]);

  // Restore from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setAccounts(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const persist = (updated: AmazonAccount[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setAccounts(updated);
  };

  const connectAccount = useCallback(async (credentials: ConnectCredentials): Promise<AmazonAccount> => {
    setIsConnecting(true);
    // Simulate SP-API OAuth handshake latency
    await delay(2200);

    const marketplaceName = MARKETPLACE_NAMES[credentials.marketplace] || credentials.marketplace;
    const account: AmazonAccount = {
      id: `amz_${Date.now()}`,
      sellerId: credentials.sellerId,
      storeName: `${credentials.sellerId.slice(0, 8).toUpperCase()} — ${marketplaceName}`,
      marketplace: credentials.marketplace,
      marketplaceCode: credentials.marketplaceCode,
      region: credentials.region,
      connectedAt: new Date().toISOString(),
      lastSync: null,
      status: 'active',
    };

    persist([...accounts, account]);
    setIsConnecting(false);
    return account;
  }, [accounts]);

  const disconnectAccount = useCallback((accountId: string) => {
    persist(accounts.filter((a) => a.id !== accountId));
  }, [accounts]);

  const syncAccount = useCallback(async (accountId: string) => {
    setSyncingIds((prev) => [...prev, accountId]);
    // Simulate a real API call — in production, this would fetch live data
    await delay(1400);
    const updated = accounts.map((a) =>
      a.id === accountId ? { ...a, lastSync: new Date().toISOString() } : a
    );
    persist(updated);
    setSyncingIds((prev) => prev.filter((id) => id !== accountId));
  }, [accounts]);

  return (
    <AmazonContext.Provider value={{ accounts, isConnecting, syncingIds, connectAccount, disconnectAccount, syncAccount }}>
      {children}
    </AmazonContext.Provider>
  );
}

export function useAmazon() {
  const ctx = useContext(AmazonContext);
  if (!ctx) throw new Error('useAmazon must be used within AmazonProvider');
  return ctx;
}
