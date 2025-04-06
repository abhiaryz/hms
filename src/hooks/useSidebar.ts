'use client';

import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useSidebar = create<SidebarState>()((set) => ({
  isCollapsed: false,
  toggleSidebar: () => set((state: SidebarState) => ({ isCollapsed: !state.isCollapsed })),
})); 