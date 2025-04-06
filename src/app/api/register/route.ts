import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db("hotel_management");
    const data = await request.json();
    
    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = {
      ...data,
      password: hashedPassword,
      role: data.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("users").insertOne(user);
    
    return NextResponse.json({ 
      message: 'User registered successfully',
      userId: result.insertedId 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
} 