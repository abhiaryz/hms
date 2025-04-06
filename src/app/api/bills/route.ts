import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/bills - Get all bills
export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const bills = await db.collection("bills")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json({ error: 'Failed to fetch bills' }, { status: 500 });
  }
}

// POST /api/bills - Create a new bill
export async function POST(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const data = await request.json();
    
    const bill = {
      ...data,
      charges: {
        roomCharges: data.charges?.roomCharges || 0,
        foodCharges: data.charges?.foodCharges || 0,
        amenitiesCharges: data.charges?.amenitiesCharges || 0,
        taxes: data.charges?.taxes || 0,
        total: data.charges?.total || 0
      },
      payments: data.payments || [],
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("bills").insertOne(bill);
    
    return NextResponse.json({ 
      message: 'Bill created successfully',
      billId: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create bill' }, { status: 500 });
  }
}

// PUT /api/bills/:id - Update a bill
export async function PUT(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const result = await db.collection("bills").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ 
      message: 'Bill updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update bill' }, { status: 500 });
  }
}

// DELETE /api/bills/:id - Delete a bill
export async function DELETE(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Bill ID is required' }, { status: 400 });
    }
    
    const result = await db.collection("bills").deleteOne({
      _id: new ObjectId(id)
    });
    
    return NextResponse.json({ 
      message: 'Bill deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete bill' }, { status: 500 });
  }
} 