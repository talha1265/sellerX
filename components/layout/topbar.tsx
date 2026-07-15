'use client';

import { useState, useEffect, useRef } from 'react';
import { useUIState } from '@/context/ui-context';
import { useAuth } from '@/context/auth-context';
import { cn, getInitials } from '@/lib/utils';
import Link from 'next/link';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Command,
  Wifi,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  Shield,
} from 'lucide-react';

export function Topbar() {
  const { sidebarCollapsed, setSidebarMobileOpen } = useUIState();
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const systemPrefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && systemPrefers)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const userInitials = getInitials(user?.firstName, user?.lastName) || 'TX';
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Talha X';
  const userRole = user?.role || 'Portfolio Manager';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 px-6 glass transition-[padding-left] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]',
        sidebarCollapsed ? 'lg:pl-[96px]' : 'lg:pl-[284px]',
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarMobileOpen(true)}
          className="rounded-xl p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className={cn(
          'relative hidden md:block transition-all duration-300',
          searchFocused ? 'w-80' : 'w-64',
        )}>
          <Search className={cn(
            'absolute left-3 top-2.5 h-4 w-4 transition-colors',
            searchFocused ? 'text-primary' : 'text-muted-foreground',
          )} />
          <input
            type="text"
            placeholder="Search brands, inventory, trades..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              'h-9 w-full rounded-xl border bg-secondary/50 pl-9 pr-16 text-sm outline-none transition-all duration-300',
              searchFocused
                ? 'border-primary/40 bg-background shadow-lg shadow-primary/5 ring-1 ring-primary/20'
                : 'border-transparent hover:border-border hover:bg-secondary',
            )}
          />
          <div className="absolute right-2 top-1.5 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border bg-muted/80 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Status Pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 mr-1">
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">All Systems Active</span>
          <Wifi className="h-3 w-3 text-emerald-500" />
        </div>

        {/* Theme */}
        <button
          onClick={toggleTheme}
          className="relative rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground group"
          aria-label="Toggle theme"
        >
          <div className="relative">
            {isDark ? <Sun className="h-[18px] w-[18px] transition-transform group-hover:rotate-45" /> : <Moon className="h-[18px] w-[18px] transition-transform group-hover:-rotate-12" />}
          </div>
        </button>

        {/* Notifications */}
        <button className="relative rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-50" />
            <span className="inline-flex h-2 w-2 rounded-full bg-rose-500" />
          </span>
        </button>

        {/* Divider */}
        <div className="hidden sm:block h-6 w-px bg-border mx-1.5" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-1.5 transition-all hover:border-border hover:bg-secondary/60 group"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-xs font-bold text-white shadow-md shadow-indigo-500/25">
              {userInitials}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-semibold leading-tight">{userName}</p>
              <p className="text-[10px] text-muted-foreground">{userRole}</p>
            </div>
            <ChevronDown className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 hidden sm:block",
              dropdownOpen && "rotate-180"
            )} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-border bg-card p-2 shadow-2xl glass-border animate-scale-in">
              <div className="px-3 py-2 border-b border-border/50">
                <p className="text-xs font-bold text-foreground">{userName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email || 'talha@sellerx.io'}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  My Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <SettingsIcon className="h-3.5 w-3.5" />
                  Account Settings
                </Link>
                <Link
                  href="/integrations"
                  onClick={() => setDropdownOpen(false)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  API Connections
                </Link>
              </div>
              <div className="border-t border-border/50 pt-1 mt-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
