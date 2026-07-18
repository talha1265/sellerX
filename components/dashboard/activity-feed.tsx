'use client';

import { useState, useEffect } from 'react';
import { Clock, ShoppingBag, ShieldAlert, Edit, Radio } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

interface Activity {
  id: string;
  type: string;
  user: string;
  action: string;
  time: string;
  detail: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setActivities([]);
      setLoading(false);
      return;
    }
    const fetchActivity = async () => {
      try {
        const res = await fetch('/api/finance', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activity || []);
        }
      } catch (err) {
        console.error('Failed to fetch activity feed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [token]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'auth':
        return <ShieldAlert className="h-3.5 w-3.5 text-indigo-500" />;
      case 'campaign':
        return <Edit className="h-3.5 w-3.5 text-emerald-500" />;
      case 'sync':
        return <Radio className="h-3.5 w-3.5 text-amber-500 animate-pulse" />;
      default:
        return <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 border border-cyan-500/20">
            <Clock className="h-4 w-4 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-base font-bold">Activity Feed</h3>
            <p className="text-[11px] text-muted-foreground">Real-time events across all systems</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-muted-foreground">
          Loading activities...
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-4">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary border border-border mt-0.5">
                {getIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  <span className="text-primary font-bold">{act.user}</span> {act.action}
                </p>
                {act.detail && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{act.detail}</p>
                )}
                <span className="text-[9px] text-muted-foreground/60 block mt-1">
                  {formatRelativeTime(act.time)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border mb-4">
            <Clock className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1">No Activity Yet</p>
          <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed mb-4">
            Live events — orders, trades, alerts, and system actions — will stream here once your integrations are connected.
          </p>
          <a
            href="/amazon"
            className="flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2 text-[11px] font-bold text-primary hover:bg-primary/20 transition-all"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Connect Amazon Account
          </a>
        </div>
      )}
    </div>
  );
}
