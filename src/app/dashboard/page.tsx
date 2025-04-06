'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hotel Management Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Total Rooms</h2>
            <span className="text-2xl font-bold text-blue-600">50</span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Occupied</span>
              <span className="font-medium">35</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vacant</span>
              <span className="font-medium">15</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Maintenance</span>
              <span className="font-medium">3</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's Bookings</h2>
            <span className="text-2xl font-bold text-green-600">12</span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Check-ins</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Check-outs</span>
              <span className="font-medium">4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pending</span>
              <span className="font-medium">3</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's Orders</h2>
            <span className="text-2xl font-bold text-purple-600">24</span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Room Service</span>
              <span className="font-medium">15</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amenities</span>
              <span className="font-medium">6</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Housekeeping</span>
              <span className="font-medium">3</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's Revenue</h2>
            <span className="text-2xl font-bold text-amber-600">$5,240</span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Room Charges</span>
              <span className="font-medium">$4,200</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Food & Beverage</span>
              <span className="font-medium">$840</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Services</span>
              <span className="font-medium">$200</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">301</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">John Doe</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Apr 5, 2024</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Apr 10, 2024</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">205</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Jane Smith</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Apr 6, 2024</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Apr 8, 2024</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">401</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Robert Johnson</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Apr 7, 2024</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Apr 12, 2024</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Confirmed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">301</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Room Service</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Breakfast</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">8:30 AM</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">205</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Amenities</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Extra Towels</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">9:15 AM</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">401</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Housekeeping</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">Daily Cleaning</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">10:00 AM</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      In Progress
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 