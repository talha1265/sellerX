'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';

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
  const { token } = useAuth();

  // Restore from database API on mount
  useEffect(() => {
    if (!token) {
      setAccounts([]);
      return;
    }
    const fetchAccounts = async () => {
      try {
        const res = await fetch('/api/amazon/accounts', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAccounts(data);
        }
      } catch (err) {
        console.error('Failed to fetch accounts:', err);
      }
    };
    fetchAccounts();
  }, [token]);

  const connectAccount = useCallback(async (credentials: ConnectCredentials): Promise<AmazonAccount> => {
    setIsConnecting(true);
    try {
      const res = await fetch('/api/amazon/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to connect account');
      }
      setAccounts((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [token]);

  const disconnectAccount = useCallback(async (accountId: string) => {
    try {
      const res = await fetch(`/api/amazon/accounts?id=${accountId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to disconnect account');
      }
      setAccounts((prev) => prev.filter((a) => a.id !== accountId));
    } catch (err) {
      console.error('Failed to disconnect account:', err);
    }
  }, [token]);

  const syncAccount = useCallback(async (accountId: string) => {
    setSyncingIds((prev) => [...prev, accountId]);
    try {
      const res = await fetch('/api/amazon/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ accountId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Sync failed');
      }
      setAccounts((prev) =>
        prev.map((a) => (a.id === accountId ? data.account : a))
      );
    } catch (err) {
      console.error('Failed to sync account:', err);
    } finally {
      setSyncingIds((prev) => prev.filter((id) => id !== accountId));
    }
  }, [token]);

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
