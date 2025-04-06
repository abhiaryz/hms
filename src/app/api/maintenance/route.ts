import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface MaintenanceTask {
  _id?: ObjectId;
  roomId: string;
  issue: string;
  priority: string;
  scheduledDate: Date;
  assignedTo?: string;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MaintenanceHistory {
  taskId: ObjectId;
  date: Date;
  issue: string;
  resolved: boolean;
}

// GET /api/maintenance - Get all maintenance requests
export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const maintenance = await db.collection("maintenance")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(maintenance);
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    return NextResponse.json({ error: 'Failed to fetch maintenance requests' }, { status: 500 });
  }
}

// POST /api/maintenance - Create a new maintenance task
export async function POST(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const data = await request.json();
    
    const task: MaintenanceTask = {
      roomId: data.roomId,
      issue: data.issue,
      priority: data.priority,
      scheduledDate: new Date(data.scheduledDate),
      assignedTo: data.assignedTo,
      status: 'pending',
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("maintenance").insertOne(task);
    
    // Update room maintenance history
    const historyEntry: MaintenanceHistory = {
      taskId: result.insertedId,
      date: task.scheduledDate,
      issue: task.issue,
      resolved: false
    };
    
    await db.collection("rooms").updateOne(
      { _id: new ObjectId(data.roomId) },
      { $push: { "maintenanceHistory": historyEntry } as any }
    );
    
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
    const client = await connectToDatabase();
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
    
    // If task is marked as resolved, update room maintenance history
    if (updateData.status === 'resolved') {
      await db.collection("rooms").updateOne(
        { 
          _id: new ObjectId(updateData.roomId),
          'maintenanceHistory.taskId': new ObjectId(id)
        },
        { 
          $set: { 
            'maintenanceHistory.$.resolved': true
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
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }
    
    // Get the task details before deletion
    const task = await db.collection("maintenance").findOne({ _id: new ObjectId(id) });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Remove task from maintenance collection
    const result = await db.collection("maintenance").deleteOne({
      _id: new ObjectId(id)
    });
    
    // Remove task from room's maintenance history
    await db.collection("rooms").updateOne(
      { _id: new ObjectId(task.roomId) },
      { $pull: { "maintenanceHistory": { taskId: new ObjectId(id) } } as any }
    );
    
    return NextResponse.json({ 
      message: 'Maintenance task deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete maintenance task' }, { status: 500 });
  }
} 