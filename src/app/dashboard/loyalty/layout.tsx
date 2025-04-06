"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Star, Award, Crown, Medal } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function LoyaltyLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isRoot = pathname === '/dashboard/loyalty';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard/loyalty" className="text-xl font-bold text-gray-800">
                  Loyalty Program
                </Link>
              </div>
              {!isRoot && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    href="/dashboard/loyalty"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === '/dashboard/loyalty'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Star className="mr-1" size={16} />
                    All Members
                  </Link>
                  <Link
                    href="/dashboard/loyalty/tiers"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === '/dashboard/loyalty/tiers'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Crown className="mr-1" size={16} />
                    Tiers & Benefits
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 