'use client';

import React from 'react';
import { Sidenav } from '@/components/ui/sidenav';
import { Header } from '@/components/header';
import { useSidebar } from '@/hooks/useSidebar';

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex h-full">
      <Sidenav />
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'pl-16' : 'pl-64'}`}>
        <Header />
        <main className="flex-1 p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 