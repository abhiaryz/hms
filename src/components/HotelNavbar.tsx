'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Calendar,
  History,
  PlusCircle,
  Bell,
  Coffee,
  Wrench,
  CreditCard,
  FileText,
  Wallet,
  Home,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'My Bookings',
    items: [
      { name: 'Current Reservation', href: '/hotel/bookings/current', icon: Calendar },
      { name: 'Booking History', href: '/hotel/bookings/history', icon: History },
      { name: 'Make New Booking', href: '/hotel/bookings/new', icon: PlusCircle },
    ],
  },
  {
    title: 'Services',
    items: [
      { name: 'Room Service', href: '/hotel/services/room-service', icon: Coffee },
      { name: 'Amenities Request', href: '/hotel/services/amenities', icon: Bell },
      { name: 'Housekeeping Request', href: '/hotel/services/housekeeping', icon: Wrench },
    ],
  },
  {
    title: 'Payments',
    items: [
      { name: 'View Invoices', href: '/hotel/payments/invoices', icon: FileText },
      { name: 'Payment Methods', href: '/hotel/payments/methods', icon: Wallet },
    ],
  },
];

export function HotelNavbar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <div className="space-y-8">
        <Link
          href="/hotel"
          className={cn(
            'flex items-center px-3 py-2 text-sm font-medium rounded-md',
            pathname === '/hotel'
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          )}
        >
          <Home className="mr-3 h-5 w-5" />
          Dashboard
        </Link>
        {navigationItems.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                      pathname === item.href
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
} 