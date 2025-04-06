import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/maintenance - Get all maintenance tasks
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const tasks = await db.collection("maintenance")
      .find({})
      .sort({ scheduledDate: 1 })
      .toArray();
    
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch maintenance tasks' }, { status: 500 });
  }
}

// POST /api/maintenance - Create a new maintenance task
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const data = await request.json();
    
    const task = {
      ...data,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("maintenance").insertOne(task);
    
    // If room-specific task, update room's maintenance history
    if (data.roomId) {
      await db.collection("rooms").updateOne(
        { _id: new ObjectId(data.roomId) },
        { 
          $push: { 
            maintenanceHistory: {
              taskId: result.insertedId,
              date: data.scheduledDate,
              issue: data.description,
              resolved: false
            }
          }
        }
      );
    }
    
    return NextResponse.json({ 
      message: 'Maintenance task created successfully',
      taskId: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create maintenance task' }, { status: 500 });
  }
}

// PUT /api/maintenance/:id - Update a maintenance task
export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const result = await db.collection("maintenance").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    // If task is completed, update room's maintenance history
    if (updateData.status === 'completed' && updateData.roomId) {
      await db.collection("rooms").updateOne(
        { 
          _id: new ObjectId(updateData.roomId),
          'maintenanceHistory.taskId': new ObjectId(id)
        },
        { 
          $set: { 
            'maintenanceHistory.$.resolved': true,
            'maintenanceHistory.$.notes': updateData.notes
          }
        }
      );
    }
    
    return NextResponse.json({ 
      message: 'Maintenance task updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update maintenance task' }, { status: 500 });
  }
}

// DELETE /api/maintenance/:id - Delete a maintenance task
export async function DELETE(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }
    
    // Get task before deleting to check if it's room-specific
    const task = await db.collection("maintenance").findOne({ 
      _id: new ObjectId(id) 
    });
    
    const result = await db.collection("maintenance").deleteOne({
      _id: new ObjectId(id)
    });
    
    // If room-specific task, remove from room's maintenance history
    if (task?.roomId) {
      await db.collection("rooms").updateOne(
        { _id: new ObjectId(task.roomId) },
        { 
          $pull: { 
            maintenanceHistory: { taskId: new ObjectId(id) }
          }
        }
      );
    }
    
    return NextResponse.json({ 
      message: 'Maintenance task deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete maintenance task' }, { status: 500 });
  }
} 