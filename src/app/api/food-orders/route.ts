import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/food-orders - Get all food orders
export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const foodOrders = await db.collection("foodOrders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(foodOrders);
  } catch (error) {
    console.error('Error fetching food orders:', error);
    return NextResponse.json({ error: 'Failed to fetch food orders' }, { status: 500 });
  }
}

// POST /api/food-orders - Create a new food order
export async function POST(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const data = await request.json();
    
    // Calculate total amount
    const totalAmount = data.items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const foodOrder = {
      ...data,
      totalAmount,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("foodOrders").insertOne(foodOrder);
    
    // Update bill with food charges
    await db.collection("bills").updateOne(
      { bookingId: new ObjectId(data.bookingId) },
      { 
        $inc: { 
          'charges.foodCharges': totalAmount,
          'charges.total': totalAmount
        }
      }
    );
    
    return NextResponse.json({ 
      message: 'Food order created successfully',
      orderId: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create food order' }, { status: 500 });
  }
}

// PUT /api/food-orders/:id - Update a food order
export async function PUT(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const result = await db.collection("foodOrders").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ 
      message: 'Food order updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update food order' }, { status: 500 });
  }
}

// DELETE /api/food-orders/:id - Delete a food order
export async function DELETE(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Food order ID is required' }, { status: 400 });
    }
    
    // Get the food order before deleting
    const foodOrder = await db.collection("foodOrders").findOne({ 
      _id: new ObjectId(id) 
    });
    
    if (!foodOrder) {
      return NextResponse.json({ error: 'Food order not found' }, { status: 404 });
    }
    
    const result = await db.collection("foodOrders").deleteOne({
      _id: new ObjectId(id)
    });
    
    // Update bill by subtracting the food charges
    await db.collection("bills").updateOne(
      { bookingId: new ObjectId(foodOrder.bookingId) },
      { 
        $inc: { 
          'charges.foodCharges': -foodOrder.totalAmount,
          'charges.total': -foodOrder.totalAmount
        }
      }
    );
    
    return NextResponse.json({ 
      message: 'Food order deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete food order' }, { status: 500 });
  }
} 