'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Create a client component that uses useSearchParams
function RoomServiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomNumber = searchParams.get('room');
  
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
  
  // Calculate total when order items change
  useEffect(() => {
    const newTotal = orderItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setTotal(newTotal);
  }, [orderItems]);
  
  // Handle item selection change
  const handleItemChange = (id: number, value: string) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        return { ...item, item: value, price: menuItems[value as keyof typeof menuItems] || 0 };
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty items
    const validItems = orderItems.filter(item => item.item !== '');
    
    if (validItems.length === 0) {
      alert('Please select at least one item');
      return;
    }
    
    // In a real app, this would send the order to an API
    console.log('Order submitted:', {
      roomNumber,
      items: validItems,
      deliveryTime,
      specialInstructions,
      total
    });
    
    // Redirect to room detail page
    router.push(`/dashboard/rooms/${roomNumber}`);
  };
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Room Service</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <h2 className="text-base font-semibold mb-2">Room Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Room Number</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5 text-sm"
                  placeholder="Enter your room number"
                  value={roomNumber || ''}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Time</label>
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5 text-sm"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                >
                  <option>As soon as possible</option>
                  <option>In 30 minutes</option>
                  <option>In 1 hour</option>
                  <option>At a specific time</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="border rounded-lg p-3">
              <h3 className="font-semibold mb-2 text-sm">Breakfast Menu</h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className="flex justify-between">
                  <span>Continental Breakfast</span>
                  <span className="font-medium">$15</span>
                </li>
                <li className="flex justify-between">
                  <span>Full English Breakfast</span>
                  <span className="font-medium">$25</span>
                </li>
                <li className="flex justify-between">
                  <span>Pancakes with Maple Syrup</span>
                  <span className="font-medium">$18</span>
                </li>
                <li className="flex justify-between">
                  <span>Fresh Fruit Platter</span>
                  <span className="font-medium">$12</span>
                </li>
              </ul>
            </div>
            <div className="border rounded-lg p-3">
              <h3 className="font-semibold mb-2 text-sm">Lunch Menu</h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className="flex justify-between">
                  <span>Club Sandwich</span>
                  <span className="font-medium">$16</span>
                </li>
                <li className="flex justify-between">
                  <span>Caesar Salad</span>
                  <span className="font-medium">$14</span>
                </li>
                <li className="flex justify-between">
                  <span>Burger with Fries</span>
                  <span className="font-medium">$20</span>
                </li>
                <li className="flex justify-between">
                  <span>Pasta Carbonara</span>
                  <span className="font-medium">$18</span>
                </li>
              </ul>
            </div>
            <div className="border rounded-lg p-3">
              <h3 className="font-semibold mb-2 text-sm">Dinner Menu</h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className="flex justify-between">
                  <span>Grilled Salmon</span>
                  <span className="font-medium">$28</span>
                </li>
                <li className="flex justify-between">
                  <span>Beef Steak</span>
                  <span className="font-medium">$35</span>
                </li>
                <li className="flex justify-between">
                  <span>Vegetarian Pasta</span>
                  <span className="font-medium">$22</span>
                </li>
                <li className="flex justify-between">
                  <span>Chicken Alfredo</span>
                  <span className="font-medium">$24</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-semibold">Your Order</h2>
              <button 
                type="button" 
                onClick={addOrderItem}
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                + Add Item
              </button>
            </div>
            <div className="border rounded-lg p-3">
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-grow mr-2">
                      <select 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5 text-sm"
                        value={item.item}
                        onChange={(e) => handleItemChange(item.id, e.target.value)}
                      >
                        <option value="">Select an item</option>
                        {Object.keys(menuItems).map((menuItem) => (
                          <option key={menuItem} value={menuItem}>{menuItem}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-20 mr-2">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5 text-sm"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="w-16 text-right mr-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeOrderItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={orderItems.length === 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-base font-semibold mb-2">Special Instructions</h2>
            <textarea
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5 text-sm"
              placeholder="Any special instructions for your order"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-base font-semibold">
              Total: <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
            <div className="flex space-x-2">
              <button 
                type="button" 
                onClick={() => router.back()}
                className="bg-gray-200 text-gray-700 py-1.5 px-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-blue-600 text-white py-1.5 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
              >
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function RoomServicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoomServiceContent />
    </Suspense>
  );
} 