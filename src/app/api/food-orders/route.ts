import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import { FoodOrder } from '@/models/FoodOrder';
import mongoose from 'mongoose';

// GET /api/food-orders - Get all food orders
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const roomNumber = searchParams.get('room');
    const status = searchParams.get('status');
    
    await connectToDatabase();
    
    const query: any = {};
    
    if (roomNumber) {
      query.roomNumber = roomNumber;
    }
    
    if (status) {
      query.status = status;
    }
    
    const orders = await FoodOrder.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching food orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/food-orders - Create a new food order
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { roomNumber, items, deliveryTime, specialInstructions, total, status, type } = body;
    
    // Validate room number
    if (!roomNumber) {
      return NextResponse.json(
        { error: 'Room number is required' },
        { status: 400 }
      );
    }
    
    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Create a new food order with the session user ID
    const foodOrder = await FoodOrder.create({
      roomNumber,
      items,
      deliveryTime,
      specialInstructions,
      total,
      status,
      type,
      createdBy: session.user.id || new mongoose.Types.ObjectId(), // Use a new ObjectId if user.id is not available
      createdAt: new Date()
    });
    
    return NextResponse.json(
      { message: 'Order placed successfully', order: foodOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating food order:', error);
    // Return more detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to place order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/food-orders/:id - Update a food order
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Food order ID is required' },
        { status: 400 }
      );
    }
    
    const result = await FoodOrder.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!result) {
      return NextResponse.json(
        { error: 'Food order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Food order updated successfully',
      order: result
    });
  } catch (error) {
    console.error('Error updating food order:', error);
    return NextResponse.json(
      { error: 'Failed to update food order' },
      { status: 500 }
    );
  }
}

// DELETE /api/food-orders/:id - Delete a food order
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Food order ID is required' },
        { status: 400 }
      );
    }
    
    // Get the food order before deleting
    const foodOrder = await FoodOrder.findById(id);
    
    if (!foodOrder) {
      return NextResponse.json(
        { error: 'Food order not found' },
        { status: 404 }
      );
    }
    
    // Delete the food order
    await FoodOrder.findByIdAndDelete(id);
    
    // If there's a booking ID, update the bill
    if (foodOrder.bookingId) {
      // Note: This assumes you have a Bill model. If not, you may need to adjust this part.
      // await Bill.findOneAndUpdate(
      //   { bookingId: foodOrder.bookingId },
      //   { 
      //     $inc: { 
      //       'charges.foodCharges': -foodOrder.total,
      //       'charges.total': -foodOrder.total
      //     }
      //   }
      // );
    }
    
    return NextResponse.json({ 
      message: 'Food order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting food order:', error);
    return NextResponse.json(
      { error: 'Failed to delete food order' },
      { status: 500 }
    );
  }
} 