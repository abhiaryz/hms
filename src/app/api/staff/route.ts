import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/staff - Get all staff members
export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const staff = await db.collection("staff")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

// POST /api/staff - Create a new staff member
export async function POST(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const data = await request.json();
    
    const staff = {
      ...data,
      status: 'active',
      performance: {
        rating: 0,
        reviews: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("staff").insertOne(staff);
    
    return NextResponse.json({ 
      message: 'Staff member created successfully',
      staffId: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create staff member' }, { status: 500 });
  }
}

// PUT /api/staff/:id - Update a staff member
export async function PUT(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const result = await db.collection("staff").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ 
      message: 'Staff member updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update staff member' }, { status: 500 });
  }
}

// DELETE /api/staff/:id - Delete a staff member
export async function DELETE(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }
    
    const result = await db.collection("staff").deleteOne({
      _id: new ObjectId(id)
    });
    
    return NextResponse.json({ 
      message: 'Staff member deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete staff member' }, { status: 500 });
  }
} 