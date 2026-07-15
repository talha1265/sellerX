'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { User, Shield, Bell, Key, Trash } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || 'Talha');
  const [lastName, setLastName] = useState(user?.lastName || 'X');
  const [email, setEmail] = useState(user?.email || 'talha@sellerx.io');

  const [notifEmails, setNotifEmails] = useState(true);
  const [notifTrades, setNotifTrades] = useState(true);
  const [notifStock, setNotifStock] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          System <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure profile accounts, API access keys, and email warning frequencies.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Profile Credentials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-muted-foreground uppercase">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-xs outline-none focus:border-primary/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-muted-foreground uppercase">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-xs outline-none focus:border-primary/40"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-bold text-muted-foreground uppercase">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="h-10 w-full rounded-xl border border-border bg-secondary/10 px-3.5 text-xs outline-none text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>
          <button className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:brightness-105 transition-colors cursor-pointer">
            Save Changes
          </button>
        </div>

        {/* Notifications Toggles */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" /> Notification Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold">Email Digest Summary</p>
                <p className="text-[10px] text-muted-foreground">Receive a weekly summary email of brand performances.</p>
              </div>
              <button
                onClick={() => setNotifEmails(!notifEmails)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  notifEmails ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                  notifEmails ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold">Real-time Trade Fills</p>
                <p className="text-[10px] text-muted-foreground">Get live desktop warnings when options/futures contracts fill.</p>
              </div>
              <button
                onClick={() => setNotifTrades(!notifTrades)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  notifTrades ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                  notifTrades ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold">Low Inventory Warnings</p>
                <p className="text-[10px] text-muted-foreground">Send notifications immediately if a listing falls below 14 runout days.</p>
              </div>
              <button
                onClick={() => setNotifStock(!notifStock)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  notifStock ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                  notifStock ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* API keys */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" /> API Access Tokens
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50">
              <div>
                <p className="text-xs font-bold font-mono">sk_live_a8f...42e9</p>
                <p className="text-[9px] text-muted-foreground">Active • Created Jul 01, 2026</p>
              </div>
              <button className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer">
                Revoke Key
              </button>
            </div>
          </div>
          <button className="mt-4 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary transition-all cursor-pointer">
            Generate API Key
          </button>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <h3 className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
            <Trash className="h-4 w-4" /> Danger Zone
          </h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Once you delete your account user data, this action cannot be undone. All active Amazon SP-API credentials, options trading logs, and system preferences will be permanently wiped.
          </p>
          <button className="mt-4 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer">
            Delete Profile Account
          </button>
        </div>
      </div>
    </div>
  );
}
