import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const client = await connectToDatabase();
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
    
    const result = await db.collection("bills").updateOne(
      { _id: new ObjectId(id) },
      { 
        $push: { payments: payment },
        $set: { updatedAt: new Date() }
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