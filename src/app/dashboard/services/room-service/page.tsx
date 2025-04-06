'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { OrderList } from '@/components/room-service/OrderList';

function RoomServiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomNumber = searchParams.get('room');
  const type = searchParams.get('type') || 'food';
  
  const [orderItems, setOrderItems] = useState([
    { id: 1, item: '', quantity: 1, price: 0 },
    { id: 2, item: '', quantity: 1, price: 0 }
  ]);
  
  const [deliveryTime, setDeliveryTime] = useState('As soon as possible');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [total, setTotal] = useState(0);
  
  // Menu items with prices
  const menuItems = {
    'Continental Breakfast': 15,
    'Full English Breakfast': 25,
    'Pancakes with Maple Syrup': 18,
    'Fresh Fruit Platter': 12,
    'Club Sandwich': 16,
    'Caesar Salad': 14,
    'Burger with Fries': 20,
    'Pasta Carbonara': 18,
    'Grilled Salmon': 28,
    'Beef Steak': 35,
    'Vegetarian Pasta': 22,
    'Chicken Alfredo': 24
  };
  
  // Amenity items with prices
  const amenityItems = {
    'Extra Towels': 0,
    'Extra Pillows': 0,
    'Bathrobe': 15,
    'Slippers': 10,
    'Toiletries Set': 12,
    'Room Cleaning': 0,
    'Turn Down Service': 0,
    'Mini Bar Refill': 25,
    'Laundry Service': 30,
    'Iron and Ironing Board': 0
  };
  
  // Calculate total when order items change
  useEffect(() => {
    const newTotal = orderItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setTotal(newTotal);
  }, [orderItems]);
  
  // Handle item selection change
  const handleItemChange = (id: number, value: string, type: 'food' | 'amenity') => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const items = type === 'food' ? menuItems : amenityItems;
        return { ...item, item: value, price: items[value as keyof typeof items] || 0 };
      }
      return item;
    }));
  };
  
  // Handle quantity change
  const handleQuantityChange = (id: number, value: number) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: value };
      }
      return item;
    }));
  };
  
  // Add a new item to the order
  const addOrderItem = () => {
    const newId = Math.max(...orderItems.map(item => item.id)) + 1;
    setOrderItems([...orderItems, { id: newId, item: '', quantity: 1, price: 0 }]);
  };
  
  // Remove an item from the order
  const removeOrderItem = (id: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty items
    const validItems = orderItems.filter(item => item.item !== '');
    
    if (validItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }
    
    // Validate room number
    if (!roomNumber) {
      toast.error('Room number is required');
      return;
    }
    
    try {
      const response = await fetch('/api/food-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomNumber,
          items: validItems,
          deliveryTime,
          specialInstructions,
          total,
          status: 'pending',
          type: type === 'food' ? 'room-service' : 'amenity'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to place order');
      }
      
      toast.success('Order placed successfully');
      
      // Redirect to room detail page
      router.push(`/dashboard/rooms/${roomNumber}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Room Service</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue={type} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="food">Food & Beverages</TabsTrigger>
              <TabsTrigger value="amenity">Amenities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="food">
              <Card>
                <CardHeader>
                  <CardTitle>Food & Beverage Order</CardTitle>
                  <CardDescription>
                    Place an order for food and beverages to be delivered to room {roomNumber}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      {orderItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                          <div className="col-span-6">
                            <Label htmlFor={`item-${item.id}`}>Item</Label>
                            <Select 
                              value={item.item} 
                              onValueChange={(value) => handleItemChange(item.id, value, 'food')}
                            >
                              <SelectTrigger id={`item-${item.id}`}>
                                <SelectValue placeholder="Select an item" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(menuItems).map(([name, price]) => (
                                  <SelectItem key={name} value={name}>
                                    {name} - ${price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-3">
                            <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                            <Input
                              id={`quantity-${item.id}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Price</Label>
                            <div className="p-2 bg-gray-100 rounded-md text-center">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                          <div className="col-span-1">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon"
                              onClick={() => removeOrderItem(item.id)}
                              disabled={orderItems.length <= 1}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addOrderItem}
                        className="w-full"
                      >
                        Add Another Item
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="delivery-time">Delivery Time</Label>
                          <Select 
                            value={deliveryTime} 
                            onValueChange={setDeliveryTime}
                          >
                            <SelectTrigger id="delivery-time">
                              <SelectValue placeholder="Select delivery time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="As soon as possible">As soon as possible</SelectItem>
                              <SelectItem value="30 minutes">30 minutes</SelectItem>
                              <SelectItem value="1 hour">1 hour</SelectItem>
                              <SelectItem value="2 hours">2 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="special-instructions">Special Instructions</Label>
                        <Textarea
                          id="special-instructions"
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          placeholder="Any special requests or allergies?"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold">
                          Total: ${total.toFixed(2)}
                        </div>
                        <Button type="submit">
                          Place Order
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="amenity">
              <Card>
                <CardHeader>
                  <CardTitle>Amenity Request</CardTitle>
                  <CardDescription>
                    Request amenities for room {roomNumber}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      {orderItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                          <div className="col-span-6">
                            <Label htmlFor={`item-${item.id}`}>Item</Label>
                            <Select 
                              value={item.item} 
                              onValueChange={(value) => handleItemChange(item.id, value, 'amenity')}
                            >
                              <SelectTrigger id={`item-${item.id}`}>
                                <SelectValue placeholder="Select an item" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(amenityItems).map(([name, price]) => (
                                  <SelectItem key={name} value={name}>
                                    {name} {price > 0 ? `- $${price}` : '(Free)'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-3">
                            <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                            <Input
                              id={`quantity-${item.id}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Price</Label>
                            <div className="p-2 bg-gray-100 rounded-md text-center">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                          <div className="col-span-1">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon"
                              onClick={() => removeOrderItem(item.id)}
                              disabled={orderItems.length <= 1}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addOrderItem}
                        className="w-full"
                      >
                        Add Another Item
                      </Button>
                      
                      <div>
                        <Label htmlFor="special-instructions">Special Instructions</Label>
                        <Textarea
                          id="special-instructions"
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          placeholder="Any special requests?"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold">
                          Total: ${total.toFixed(2)}
                        </div>
                        <Button type="submit">
                          Place Request
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <OrderList roomNumber={roomNumber || undefined} />
        </div>
      </div>
    </div>
  );
}

export default function RoomServicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoomServiceContent />
    </Suspense>
  );
} 