import { FoodOrder } from '@/models/FoodOrder';

// Define the FoodOrder interface
export interface OrderItem {
  item: string;
  quantity: number;
  price: number;
}

export interface FoodOrder {
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

/**
 * Get the status color for a room service order
 */
export function getOrderStatusColor(status: string): string {
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
}

/**
 * Format the order status for display
 */
export function formatOrderStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Calculate the total amount for an order
 */
export function calculateOrderTotal(items: OrderItem[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Get order statistics
 */
export function getOrderStats(orders: FoodOrder[]) {
  const pendingCount = orders.filter(order => order.status === 'pending').length;
  const preparingCount = orders.filter(order => order.status === 'preparing').length;
  const deliveredCount = orders.filter(order => order.status === 'delivered').length;
  const cancelledCount = orders.filter(order => order.status === 'cancelled').length;
  
  return {
    pending: pendingCount,
    preparing: preparingCount,
    delivered: deliveredCount,
    cancelled: cancelledCount,
    total: pendingCount + preparingCount + deliveredCount + cancelledCount
  };
}

/**
 * Filter orders by status
 */
export function filterOrdersByStatus(orders: FoodOrder[], status: string | null): FoodOrder[] {
  if (!status || status === 'all') {
    return orders;
  }
  
  return orders.filter(order => order.status === status);
}

/**
 * Filter orders by room number
 */
export function filterOrdersByRoom(orders: FoodOrder[], roomNumber: string | null): FoodOrder[] {
  if (!roomNumber) {
    return orders;
  }
  
  return orders.filter(order => order.roomNumber === roomNumber);
}

/**
 * Sort orders by date (newest first)
 */
export function sortOrdersByDate(orders: FoodOrder[]): FoodOrder[] {
  return [...orders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Get menu items with prices
 */
export const menuItems = {
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

/**
 * Get amenity items with prices
 */
export const amenityItems = {
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