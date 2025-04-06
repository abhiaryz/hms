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
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }
    
    const review = {
      ...data,
      date: new Date()
    };
    
    const result = await db.collection("staff").updateOne(
      { _id: new ObjectId(id) },
      { 
        $push: { reviews: review },
        $set: { updatedAt: new Date() }
      }
    );
    
    return NextResponse.json({ 
      message: 'Review added successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
} 