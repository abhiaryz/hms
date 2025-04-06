'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface OrderItem {
  item: string;
  quantity: number;
  price: number;
}

interface FoodOrder {
  _id: string;
  roomNumber: string;
  items: OrderItem[];
  deliveryTime: string;
  specialInstructions: string;
  total: number;
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
  type: 'room-service' | 'amenity';
  createdAt: string;
  updatedAt: string;
}

export function RoomServiceWidget() {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    delivered: 0,
    total: 0
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/food-orders?status=pending');
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data.slice(0, 5));
        
        // Calculate stats
        const pendingCount = data.filter((order: FoodOrder) => order.status === 'pending').length;
        const preparingCount = data.filter((order: FoodOrder) => order.status === 'preparing').length;
        const deliveredCount = data.filter((order: FoodOrder) => order.status === 'delivered').length;
        
        setStats({
          pending: pendingCount,
          preparing: preparingCount,
          delivered: deliveredCount,
          total: pendingCount + preparingCount + deliveredCount
        });
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Room Service</CardTitle>
          <CardDescription>Recent food and amenity orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Room Service</CardTitle>
          <CardDescription>Recent food and amenity orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Room Service</CardTitle>
          <CardDescription>Recent food and amenity orders</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/services/orders">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            <p className="text-xs text-blue-600">Total Orders</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            <p className="text-xs text-yellow-600">Pending</p>
          </div>
          <div className="bg-indigo-50 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-indigo-700">{stats.preparing}</p>
            <p className="text-xs text-indigo-600">Preparing</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-700">{stats.delivered}</p>
            <p className="text-xs text-green-600">Delivered</p>
          </div>
        </div>
        
        {orders.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded-md text-center">
            <p className="text-gray-600">No pending orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Room {order.roomNumber}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <div className="mt-2">
                  <p className="text-sm">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • ${order.total.toFixed(2)}
                  </p>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/services/orders?id=${order._id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 