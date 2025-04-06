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
  BarChart,
  LogOut,
  Link as LinkIcon
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useSidebar } from '@/hooks/useSidebar';
import { useRouter, usePathname } from 'next/navigation';

export function Sidenav() {
  const { data: session, status } = useSession();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();

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
      label: 'Services',
      href: '/dashboard/services',
      subItems: [
        { icon: Coffee, label: 'Room Service', href: '/dashboard/services/room-service' },
        { icon: Bell, label: 'Amenities', href: '/dashboard/services/amenities' },
        { icon: Wrench, label: 'Housekeeping', href: '/dashboard/services/housekeeping' },
        { icon: Receipt, label: 'Orders', href: '/dashboard/services/orders' },
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
    {
      icon: LinkIcon,
      label: 'Integrations',
      href: '/dashboard/integrations',
      subItems: [
        { icon: LinkIcon, label: 'Airbnb', href: '/dashboard/integrations/airbnb' },
        { icon: LinkIcon, label: 'MakeMyTrip', href: '/dashboard/integrations/makemytrip' },
        { icon: LinkIcon, label: 'Booking.com', href: '/dashboard/integrations/booking' },
      ]
    },
    { icon: User, label: 'Staff', href: '/dashboard/staff' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

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
              {item.subItems ? (
                <div>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === item.href
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                  {!isCollapsed && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.label}>
                          <Link
                            href={subItem.href}
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                              pathname === subItem.href
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <subItem.icon className="h-4 w-4 mr-3" />
                            <span>{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md"
        >
          <LogOut className="h-5 w-5 mr-3" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </nav>
  );
} 