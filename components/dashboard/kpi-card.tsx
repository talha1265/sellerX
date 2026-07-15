'use client';

import { cn, formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'currency' | 'number' | 'percentage';
  icon: LucideIcon;
  color: string;
  sparkline?: number[];
}

export function KPICard({
  label,
  value,
  change,
  changeType,
  format,
  icon: Icon,
  color,
  sparkline,
}: KPICardProps) {
  const formattedValue =
    format === 'currency'
      ? formatCurrency(value)
      : format === 'percentage'
        ? `${value}%`
        : formatNumber(value);

  const TrendIcon =
    changeType === 'increase' ? TrendingUp : changeType === 'decrease' ? TrendingDown : Minus;

  // Generate smooth sparkline path with SVG
  const sparklinePath = sparkline
    ? (() => {
        const max = Math.max(...sparkline);
        const min = Math.min(...sparkline);
        const range = max - min || 1;
        const width = 80;
        const height = 36;
        const padding = 4;
        const points = sparkline.map((v, i) => {
          const x = (i / (sparkline.length - 1)) * width;
          const y = padding + (height - 2 * padding) - ((v - min) / range) * (height - 2 * padding);
          return { x, y };
        });
        // Smooth bezier curve
        let path = `M${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
          const cp1x = points[i].x + (points[i + 1].x - points[i].x) / 3;
          const cp1y = points[i].y;
          const cp2x = points[i + 1].x - (points[i + 1].x - points[i].x) / 3;
          const cp2y = points[i + 1].y;
          path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${points[i + 1].x},${points[i + 1].y}`;
        }
        return path;
      })()
    : null;

  // Fill path for gradient area
  const sparklineFill = sparkline && sparklinePath
    ? `${sparklinePath} L80,36 L0,36 Z`
    : null;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 card-hover">
      {/* Ambient glow */}
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.04] dark:opacity-[0.08] blur-3xl transition-all duration-500 group-hover:opacity-[0.1] dark:group-hover:opacity-[0.18] group-hover:scale-125"
        style={{ backgroundColor: color }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 h-12 w-12 rounded-bl-3xl opacity-[0.03] dark:opacity-[0.06]"
        style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
      />

      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: `${color}12`, border: `1px solid ${color}20` }}
        >
          <Icon className="h-[18px] w-[18px]" style={{ color }} />
        </div>

        {/* Sparkline */}
        {sparklinePath && (
          <svg
            width="80"
            height="36"
            viewBox="0 0 80 36"
            className="opacity-30 transition-opacity duration-300 group-hover:opacity-70"
          >
            {sparklineFill && (
              <path
                d={sparklineFill}
                fill={`${color}12`}
              />
            )}
            <path
              d={sparklinePath}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* End dot */}
            {sparkline && (() => {
              const max = Math.max(...sparkline);
              const min = Math.min(...sparkline);
              const range = max - min || 1;
              const lastVal = sparkline[sparkline.length - 1];
              const y = 4 + (36 - 8) - ((lastVal - min) / range) * (36 - 8);
              return (
                <circle cx="80" cy={y} r="2.5" fill={color} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              );
            })()}
          </svg>
        )}
      </div>

      <div className="mt-3">
        <p className="text-xl font-black tracking-tight text-foreground">{formattedValue}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <p className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">{label}</p>
          <span
            className={cn(
              'flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 text-[10px] font-bold',
              changeType === 'increase' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
              changeType === 'decrease' && 'bg-red-500/10 text-red-600 dark:text-red-400',
              changeType === 'neutral' && 'bg-slate-500/10 text-slate-500',
            )}
          >
            <TrendIcon className="h-2.5 w-2.5" />
            {formatPercentage(Math.abs(change))}
          </span>
        </div>
      </div>
    </div>
  );
}
