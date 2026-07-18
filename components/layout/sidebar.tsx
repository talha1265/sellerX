'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUIState } from '@/context/ui-context';
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  Brain,
  Warehouse,
  DollarSign,
  Globe,
  Settings,
  ChevronLeft,
  Sparkles,
  Zap,
  BarChart3,
  Users,
  Bell,
  ShoppingBag,
  Megaphone,
} from 'lucide-react';

const navigation = [
  {
    label: 'Core',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'FBA Brands', href: '/brands', icon: Building2, badge: '4' },
      { name: 'Live Trading', href: '/trading', icon: TrendingUp, pulse: true },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { name: 'AI CEO Agent', href: '/ai-ceo', icon: Brain, badge: 'Pro' },
      { name: 'Ads Optimizer', href: '/ads-optimizer', icon: Megaphone, badge: 'AI' },
      { name: 'Automation', href: '/automation', icon: Zap },
      { name: 'Customers', href: '/customers', icon: Users },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Inventory', href: '/inventory', icon: Warehouse, badge: '3' },
      { name: 'Finance', href: '/finance', icon: DollarSign },
      { name: 'Amazon', href: '/amazon', icon: ShoppingBag },
      { name: 'Integrations', href: '/integrations', icon: Globe },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Notifications', href: '/notifications', icon: Bell },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIState();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar',
        'hidden lg:flex',
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/25">
          <Sparkles className="h-4 w-4 text-white" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 blur-md animate-glow-pulse" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="text-lg font-black tracking-tight">
                <span className="gradient-text">Seller</span>
                <span className="text-foreground">X</span>
              </span>
              <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary">
                v2.4
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navigation.map((section) => (
          <div key={section.label}>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary'
                          : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground',
                        sidebarCollapsed && 'justify-center px-0',
                      )}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-gradient-to-b from-primary to-purple-500"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}

                      <item.icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0 transition-all duration-200',
                          isActive ? 'text-primary' : 'text-muted-foreground/70 group-hover:text-foreground',
                        )}
                      />
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="overflow-hidden whitespace-nowrap flex-1"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Badges */}
                      {!sidebarCollapsed && 'badge' in item && item.badge && (
                        <span className={cn(
                          'rounded-md px-1.5 py-0.5 text-[9px] font-bold',
                          item.badge === 'Pro'
                            ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500'
                            : 'bg-muted text-muted-foreground',
                        )}>
                          {item.badge}
                        </span>
                      )}

                      {/* Live pulse */}
                      {!sidebarCollapsed && 'pulse' in item && item.pulse && (
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Pro card */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-3 mb-3"
          >
            <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-primary/10 p-3">
              <p className="text-xs font-bold text-foreground">Upgrade to Enterprise</p>
              <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed">
                Unlock unlimited AI agents, real-time sync & priority support.
              </p>
              <button className="mt-2.5 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:brightness-110">
                Upgrade Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded-xl p-2 text-muted-foreground/60 transition-all hover:bg-secondary hover:text-foreground"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <motion.div
            animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  );
}
