import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/loyalty - Get all loyalty members
export async function GET() {
  try {
    const client = await clientPromise;
    const db = (client as any).db("hotel_management");
    const members = await db.collection("loyalty")
      .find({})
      .sort({ points: -1 })
      .toArray();
    
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch loyalty members' }, { status: 500 });
  }
}

// POST /api/loyalty - Create a new loyalty member
// POST /api/loyalty/points - Add points to a member
// POST /api/loyalty/redeem - Redeem points
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = (client as any).db("hotel_management");
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const data = await request.json();

    // Create new member
    if (!action) {
      const member = {
        ...data,
        points: 0,
        history: [],
        benefits: getBenefitsByTier('bronze'),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection("loyalty").insertOne(member);
      
      return NextResponse.json({ 
        message: 'Loyalty member created successfully',
        memberId: result.insertedId 
      });
    }

    // Add points
    if (action === 'points') {
      if (!id) {
        return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
      }
      
      const member = await db.collection("loyalty").findOne({ _id: new ObjectId(id) });
      if (!member) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 });
      }
      
      const newPoints = member.points + data.points;
      const newTier = calculateTier(newPoints);
      
      const result = await db.collection("loyalty").updateOne(
        { _id: new ObjectId(id) },
        { 
          $inc: { points: data.points },
          $push: { 
            history: {
              type: 'earned',
              amount: data.points,
              bookingId: data.bookingId,
              date: new Date()
            }
          },
          $set: { 
            tier: newTier,
            benefits: getBenefitsByTier(newTier),
            updatedAt: new Date()
          }
        }
      );
      
      return NextResponse.json({ 
        message: 'Points added successfully',
        modifiedCount: result.modifiedCount,
        newPoints,
        newTier
      });
    }

    // Redeem points
    if (action === 'redeem') {
      if (!id) {
        return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
      }
      
      const member = await db.collection("loyalty").findOne({ _id: new ObjectId(id) });
      if (!member) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 });
      }
      
      if (member.points < data.points) {
        return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
      }
      
      const newPoints = member.points - data.points;
      const newTier = calculateTier(newPoints);
      
      const result = await db.collection("loyalty").updateOne(
        { _id: new ObjectId(id) },
        { 
          $inc: { points: -data.points },
          $push: { 
            history: {
              type: 'redeemed',
              amount: data.points,
              reward: data.reward,
              date: new Date()
            }
          },
          $set: { 
            tier: newTier,
            benefits: getBenefitsByTier(newTier),
            updatedAt: new Date()
          }
        }
      );
      
      return NextResponse.json({ 
        message: 'Points redeemed successfully',
        modifiedCount: result.modifiedCount,
        newPoints,
        newTier
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}

// PUT /api/loyalty/:id - Update a loyalty member
export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = (client as any).db("hotel_management");
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const result = await db.collection("loyalty").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ 
      message: 'Loyalty member updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update loyalty member' }, { status: 500 });
  }
}

// Helper function to calculate tier based on points
function calculateTier(points: number): string {
  if (points >= 10000) return 'platinum';
  if (points >= 5000) return 'gold';
  if (points >= 2000) return 'silver';
  return 'bronze';
}

// Helper function to get benefits by tier
function getBenefitsByTier(tier: string): any[] {
  const benefits = {
    bronze: [
      { type: 'discount', description: '5% off on room rates', active: true },
      { type: 'welcome', description: 'Welcome drink on arrival', active: true }
    ],
    silver: [
      { type: 'discount', description: '10% off on room rates', active: true },
      { type: 'welcome', description: 'Welcome drink on arrival', active: true },
      { type: 'late_checkout', description: 'Late checkout until 2 PM', active: true }
    ],
    gold: [
      { type: 'discount', description: '15% off on room rates', active: true },
      { type: 'welcome', description: 'Welcome drink on arrival', active: true },
      { type: 'late_checkout', description: 'Late checkout until 4 PM', active: true },
      { type: 'breakfast', description: 'Complimentary breakfast', active: true }
    ],
    platinum: [
      { type: 'discount', description: '20% off on room rates', active: true },
      { type: 'welcome', description: 'Welcome drink on arrival', active: true },
      { type: 'late_checkout', description: 'Late checkout until 6 PM', active: true },
      { type: 'breakfast', description: 'Complimentary breakfast', active: true },
      { type: 'upgrade', description: 'Room upgrade subject to availability', active: true }
    ]
  };
  
  return benefits[tier as keyof typeof benefits] || benefits.bronze;
} 