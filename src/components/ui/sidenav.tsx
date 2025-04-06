'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  User, 
  Settings, 
  Calendar, 
  History,
  PlusCircle,
  Coffee,
  Bell,
  Wrench,
  FileText,
  Wallet,
  ChevronLeft, 
  ChevronRight,
  Building,
  BedDouble,
  Utensils,
  Receipt,
  Users,
  BarChart
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useSidebar } from '@/hooks/useSidebar';

export function Sidenav() {
  const { data: session, status } = useSession();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    {
      icon: Building,
      label: 'Room Management',
      href: '/dashboard/rooms',
      subItems: [
        { icon: BedDouble, label: 'Room Status', href: '/dashboard/rooms/status' },
        { icon: Users, label: 'Occupancy', href: '/dashboard/rooms/occupancy' },
        { icon: PlusCircle, label: 'Add Room', href: '/dashboard/rooms/add' },
      ]
    },
    {
      icon: Calendar,
      label: 'Bookings',
      href: '/dashboard/bookings',
      subItems: [
        { icon: Calendar, label: 'Current Bookings', href: '/dashboard/bookings/current' },
        { icon: History, label: 'Booking History', href: '/dashboard/bookings/history' },
        { icon: PlusCircle, label: 'New Booking', href: '/dashboard/bookings/new' },
      ]
    },
    {
      icon: Utensils,
      label: 'Orders',
      href: '/dashboard/orders',
      subItems: [
        { icon: Coffee, label: 'Room Service', href: '/dashboard/orders/room-service' },
        { icon: Bell, label: 'Amenities', href: '/dashboard/orders/amenities' },
        { icon: Wrench, label: 'Housekeeping', href: '/dashboard/orders/housekeeping' },
      ]
    },
    {
      icon: Receipt,
      label: 'Payments',
      href: '/dashboard/payments',
      subItems: [
        { icon: FileText, label: 'Invoices', href: '/dashboard/payments/invoices' },
        { icon: Wallet, label: 'Payment Methods', href: '/dashboard/payments/methods' },
        { icon: BarChart, label: 'Revenue', href: '/dashboard/payments/revenue' },
      ]
    },
    { icon: User, label: 'Staff', href: '/dashboard/staff' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <nav className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 text-gray-900 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-xl font-bold tracking-tight text-gray-900">Hotel Management</h2>}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-900"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
              {!isCollapsed && item.subItems && (
                <ul className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.label}>
                      <Link
                        href={subItem.href}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <subItem.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium text-sm">{subItem.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        {status === 'loading' ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            {!isCollapsed && (
              <div className="space-y-1">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-2 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        ) : session?.user ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || ''}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </div>
            {!isCollapsed && (
              <div>
                <p className="font-medium text-gray-900 text-sm">{session.user.name}</p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">{session.user.email}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            {!isCollapsed && (
              <div>
                <p className="font-medium text-gray-900 text-sm">Staff User</p>
                <p className="text-xs text-gray-500">Not logged in</p>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 