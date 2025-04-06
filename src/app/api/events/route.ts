import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/events - Get all events
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const events = await db.collection("events")
      .find({})
      .sort({ 'date.start': 1 })
      .toArray();
    
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events - Create a new event
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const data = await request.json();
    
    const event = {
      ...data,
      status: 'planned',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("events").insertOne(event);
    
    // Update room statuses if rooms are assigned
    if (data.venue?.rooms?.length > 0) {
      await db.collection("rooms").updateMany(
        { _id: { $in: data.venue.rooms.map((id: string) => new ObjectId(id)) } },
        { 
          $set: { 
            status: 'reserved',
            currentEvent: result.insertedId
          }
        }
      );
    }
    
    return NextResponse.json({ 
      message: 'Event created successfully',
      eventId: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

// PUT /api/events/:id - Update an event
export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const result = await db.collection("events").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    // Update room statuses if rooms are changed
    if (updateData.venue?.rooms) {
      // Get current event to check for room changes
      const currentEvent = await db.collection("events").findOne({ 
        _id: new ObjectId(id) 
      });
      
      // Remove event reference from previously assigned rooms
      if (currentEvent?.venue?.rooms) {
        await db.collection("rooms").updateMany(
          { _id: { $in: currentEvent.venue.rooms.map((id: string) => new ObjectId(id)) } },
          { 
            $set: { 
              status: 'vacant',
              currentEvent: null
            }
          }
        );
      }
      
      // Update new rooms with event reference
      await db.collection("rooms").updateMany(
        { _id: { $in: updateData.venue.rooms.map((id: string) => new ObjectId(id)) } },
        { 
          $set: { 
            status: 'reserved',
            currentEvent: new ObjectId(id)
          }
        }
      );
    }
    
    return NextResponse.json({ 
      message: 'Event updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE /api/events/:id - Delete an event
export async function DELETE(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }
    
    // Get event before deleting to check assigned rooms
    const event = await db.collection("events").findOne({ 
      _id: new ObjectId(id) 
    });
    
    const result = await db.collection("events").deleteOne({
      _id: new ObjectId(id)
    });
    
    // Update room statuses if rooms were assigned
    if (event?.venue?.rooms?.length > 0) {
      await db.collection("rooms").updateMany(
        { _id: { $in: event.venue.rooms.map((id: string) => new ObjectId(id)) } },
        { 
          $set: { 
            status: 'vacant',
            currentEvent: null
          }
        }
      );
    }
    
    return NextResponse.json({ 
      message: 'Event deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
} 