import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/inventory - Get all inventory items
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const inventory = await db.collection("inventory")
      .find({})
      .sort({ name: 1 })
      .toArray();
    
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

// POST /api/inventory - Create a new inventory item
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const data = await request.json();
    
    const item = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("inventory").insertOne(item);
    
    return NextResponse.json({ 
      message: 'Inventory item created successfully',
      itemId: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create inventory item' }, { status: 500 });
  }
}

// PUT /api/inventory/:id - Update an inventory item
export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const result = await db.collection("inventory").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ 
      message: 'Inventory item updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inventory item' }, { status: 500 });
  }
}

// POST /api/inventory/:id/restock - Restock an inventory item
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }
    
    const item = await db.collection("inventory").findOne({ _id: new ObjectId(id) });
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    const result = await db.collection("inventory").updateOne(
      { _id: new ObjectId(id) },
      { 
        $inc: { quantity: data.quantity },
        $set: { 
          lastRestocked: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ 
      message: 'Item restocked successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to restock item' }, { status: 500 });
  }
}

// DELETE /api/inventory/:id - Delete an inventory item
export async function DELETE(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }
    
    const result = await db.collection("inventory").deleteOne({
      _id: new ObjectId(id)
    });
    
    return NextResponse.json({ 
      message: 'Inventory item deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete inventory item' }, { status: 500 });
  }
} 