'use client';

import { useState } from 'react';
import { OrderList } from '@/components/room-service/OrderList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface RoomServiceSectionProps {
  roomNumber: string;
}

export function RoomServiceSection({ roomNumber }: RoomServiceSectionProps) {
  const [showAllOrders, setShowAllOrders] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Room Service</CardTitle>
          <CardDescription>
            Food and amenity orders for room {roomNumber}
          </CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href={`/dashboard/services/room-service?room=${roomNumber}`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <OrderList roomNumber={roomNumber} limit={showAllOrders ? 10 : 3} />
        
        {!showAllOrders && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAllOrders(true)}
            >
              View All Orders
            </Button>
          </div>
        )}
        
        {showAllOrders && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAllOrders(false)}
            >
              Show Less
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 