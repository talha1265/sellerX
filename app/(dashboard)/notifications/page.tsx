'use client';

import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          System <span className="gradient-text">Notifications</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Stay up to date with live order updates, stock thresholds, and algorithmic trading alerts.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border p-16 text-center">
        <Bell className="mx-auto h-10 w-10 text-muted-foreground/30 mb-4" />
        <p className="text-sm font-bold text-foreground mb-1">All Clear</p>
        <p className="text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
          You have no notifications. Alerts will appear here automatically as your integrated systems generate events.
        </p>
      </div>
    </div>
  );
}
