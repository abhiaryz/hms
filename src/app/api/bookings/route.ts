import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/bookings - Get all bookings
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const bookings = await db.collection("bookings")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const data = await request.json();
    
    const booking = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'reserved'
    };
    
    const result = await db.collection("bookings").insertOne(booking);
    
    // Update room status
    await db.collection("rooms").updateOne(
      { _id: new ObjectId(data.roomId) },
      { 
        $set: { 
          status: 'reserved',
          currentBooking: result.insertedId
        }
      }
    );
    
    return NextResponse.json({ 
      message: 'Booking created successfully',
      bookingId: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

// PUT /api/bookings/:id - Update a booking
export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const result = await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ 
      message: 'Booking updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// DELETE /api/bookings/:id - Delete a booking
export async function DELETE(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }
    
    const result = await db.collection("bookings").deleteOne({
      _id: new ObjectId(id)
    });
    
    // Update room status
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    if (booking) {
      await db.collection("rooms").updateOne(
        { _id: new ObjectId(booking.roomId) },
        { 
          $set: { 
            status: 'vacant',
            currentBooking: null
          }
        }
      );
    }
    
    return NextResponse.json({ 
      message: 'Booking deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
} 