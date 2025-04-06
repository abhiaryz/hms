'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { FoodOrder, getOrderStatusColor, formatOrderStatus } from '@/lib/room-service';

interface OrderListProps {
  roomNumber?: string;
  limit?: number;
  status?: string;
}

export function OrderList({ roomNumber, limit = 10, status }: OrderListProps) {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let url = '/api/food-orders';
        
        // Add query parameters
        const params = new URLSearchParams();
        
        if (roomNumber) {
          params.append('room', roomNumber);
        }
        
        if (status && status !== 'all') {
          params.append('status', status);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data.slice(0, limit));
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [roomNumber, limit, status]);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center">
        <p className="text-gray-600">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order._id} className="overflow-hidden">
          <CardHeader className="bg-gray-50 p-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Order #{order._id.slice(-6).toUpperCase()}</CardTitle>
                <CardDescription>
                  Room {order.roomNumber} • {formatDate(order.createdAt)}
                </CardDescription>
              </div>
              <Badge className={getOrderStatusColor(order.status)}>
                {formatOrderStatus(order.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-gray-500">Items</h4>
                <ul className="mt-1 space-y-1">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.item}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {order.specialInstructions && (
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Special Instructions</h4>
                  <p className="mt-1 text-sm">{order.specialInstructions}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Total</span>
                <span className="font-bold">${order.total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                {order.status === 'pending' && (
                  <Button variant="outline" size="sm">
                    Cancel Order
                  </Button>
                )}
                {order.status === 'delivered' && (
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 