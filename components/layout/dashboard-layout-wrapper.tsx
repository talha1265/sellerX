'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { useUIState } from '@/context/ui-context';
import { cn } from '@/lib/utils';

export function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUIState();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Topbar />
        <main
          className={cn(
            'flex-1 transition-[padding-left] duration-200 ease-in-out',
            sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
          )}
        >
          <div className="mx-auto max-w-[1600px] p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
