import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/rooms - Get all rooms
export async function GET() {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db as any;
    const rooms = await db.collection("rooms")
      .find({})
      .sort({ roomNumber: 1 })
      .toArray();
    
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

// POST /api/rooms - Create a new room
export async function POST(request: Request) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db as any;
    const data = await request.json();
    
    // Check if room number already exists
    const existingRoom = await db.collection("rooms").findOne({ roomNumber: data.roomNumber });
    if (existingRoom) {
      return NextResponse.json({ error: 'Room number already exists' }, { status: 400 });
    }
    
    const room = {
      roomNumber: data.roomNumber,
      type: data.type,
      floor: data.floor,
      capacity: parseInt(data.capacity),
      price: parseFloat(data.price),
      amenities: data.amenities || [],
      status: data.status || 'vacant',
      notes: data.notes || '',
      currentBooking: null,
      maintenanceHistory: [],
      lastCleaned: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("rooms").insertOne(room);
    
    return NextResponse.json({ 
      message: 'Room created successfully',
      roomId: result.insertedId 
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}

// PUT /api/rooms/:id - Update a room
export async function PUT(request: Request) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db as any;
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const result = await db.collection("rooms").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    return NextResponse.json({ 
      message: 'Room updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
  }
}

// DELETE /api/rooms/:id - Delete a room
export async function DELETE(request: Request) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db as any;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }
    
    // Check if room has any active bookings
    const room = await db.collection("rooms").findOne({ _id: new ObjectId(id) });
    if (room?.currentBooking) {
      return NextResponse.json({ 
        error: 'Cannot delete room with active booking' 
      }, { status: 400 });
    }
    
    const result = await db.collection("rooms").deleteOne({
      _id: new ObjectId(id)
    });
    
    return NextResponse.json({ 
      message: 'Room deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 });
  }
} 