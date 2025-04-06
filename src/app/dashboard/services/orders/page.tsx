'use client';

import { useState } from 'react';
import { OrderList } from '@/components/room-service/OrderList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Room Service Orders</h1>
        <Button asChild>
          <Link href="/dashboard/services/room-service">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <OrderList limit={20} />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <OrderList limit={20} />
        </TabsContent>
        
        <TabsContent value="preparing" className="mt-6">
          <OrderList limit={20} />
        </TabsContent>
        
        <TabsContent value="delivered" className="mt-6">
          <OrderList limit={20} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 