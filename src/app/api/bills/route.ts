import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/bills - Get all bills
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const bills = await db.collection("bills")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(bills);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bills' }, { status: 500 });
  }
}

// POST /api/bills - Create a new bill
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
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
    const client = await clientPromise;
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

// POST /api/bills/:id/payments - Add a payment to a bill
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Bill ID is required' }, { status: 400 });
    }
    
    const payment = {
      ...data,
      date: new Date()
    };
    
    const bill = await db.collection("bills").findOne({ _id: new ObjectId(id) });
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }
    
    const totalPaid = bill.payments.reduce((sum: number, p: any) => sum + p.amount, 0) + payment.amount;
    const status = totalPaid >= bill.charges.total ? 'paid' : 'partial';
    
    const result = await db.collection("bills").updateOne(
      { _id: new ObjectId(id) },
      { 
        $push: { payments: payment },
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ 
      message: 'Payment added successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add payment' }, { status: 500 });
  }
}

// DELETE /api/bills/:id - Delete a bill
export async function DELETE(request: Request) {
  try {
    const client = await clientPromise;
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