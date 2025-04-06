'use client';

import React from 'react';
import { Sidenav } from '@/components/ui/sidenav';
import { Header } from '@/components/header';
import { useSidebar } from '@/hooks/useSidebar';
import { usePathname } from 'next/navigation';

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  
  // Check if current path is login or register
  const isAuthPage = pathname === '/login' || pathname === '/register';
  
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }
  
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