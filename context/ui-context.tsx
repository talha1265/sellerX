'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UIContextType {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sellerx-sidebar-collapsed');
    if (saved) {
      setSidebarCollapsed(saved === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const newVal = !prev;
      localStorage.setItem('sellerx-sidebar-collapsed', String(newVal));
      return newVal;
    });
  };

  return (
    <UIContext.Provider
      value={{
        sidebarCollapsed,
        sidebarMobileOpen,
        commandPaletteOpen,
        toggleSidebar,
        setSidebarCollapsed,
        setSidebarMobileOpen,
        setCommandPaletteOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUIState() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIState must be used within a UIProvider');
  }
  return context;
}
