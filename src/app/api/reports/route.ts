import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/reports/occupancy - Get occupancy report
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Get total rooms
    const totalRooms = await db.collection("rooms").countDocuments();
    
    // Get occupied rooms for the period
    const occupiedRooms = await db.collection("bookings").countDocuments({
      checkIn: { $lte: new Date(endDate || new Date()) },
      checkOut: { $gte: new Date(startDate || new Date()) },
      status: { $in: ['checked-in', 'reserved'] }
    });
    
    const occupancyRate = (occupiedRooms / totalRooms) * 100;
    
    return NextResponse.json({
      totalRooms,
      occupiedRooms,
      occupancyRate,
      period: {
        start: startDate,
        end: endDate
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate occupancy report' }, { status: 500 });
  }
}

// GET /api/reports/revenue - Get revenue report
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Get all bills for the period
    const bills = await db.collection("bills").find({
      createdAt: {
        $gte: new Date(startDate || new Date()),
        $lte: new Date(endDate || new Date())
      }
    }).toArray();
    
    // Calculate revenue breakdown
    const revenue = bills.reduce((acc: any, bill: any) => {
      acc.roomCharges += bill.charges.roomCharges || 0;
      acc.foodCharges += bill.charges.foodCharges || 0;
      acc.amenitiesCharges += bill.charges.amenitiesCharges || 0;
      acc.taxes += bill.charges.taxes || 0;
      acc.total += bill.charges.total || 0;
      return acc;
    }, {
      roomCharges: 0,
      foodCharges: 0,
      amenitiesCharges: 0,
      taxes: 0,
      total: 0
    });
    
    return NextResponse.json({
      revenue,
      period: {
        start: startDate,
        end: endDate
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate revenue report' }, { status: 500 });
  }
}

// GET /api/reports/inventory - Get inventory report
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    
    // Get all inventory items
    const inventory = await db.collection("inventory").find({}).toArray();
    
    // Calculate inventory metrics
    const metrics = inventory.reduce((acc: any, item: any) => {
      if (item.quantity <= item.reorderPoint) {
        acc.lowStock.push({
          itemId: item._id,
          name: item.name,
          quantity: item.quantity,
          reorderPoint: item.reorderPoint
        });
      }
      
      acc.totalValue += item.quantity * item.price.purchase;
      acc.totalItems += item.quantity;
      
      return acc;
    }, {
      lowStock: [],
      totalValue: 0,
      totalItems: 0
    });
    
    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate inventory report' }, { status: 500 });
  }
}

// GET /api/reports/staff - Get staff performance report
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("hotel_management");
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Get all staff members
    const staff = await db.collection("staff").find({}).toArray();
    
    // Calculate performance metrics
    const metrics = staff.reduce((acc: any, member: any) => {
      const reviews = member.performance.reviews.filter((review: any) => {
        const reviewDate = new Date(review.date);
        return reviewDate >= new Date(startDate || new Date()) && 
               reviewDate <= new Date(endDate || new Date());
      });
      
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
        : 0;
      
      acc.push({
        staffId: member._id,
        name: member.name,
        role: member.role,
        averageRating,
        reviewCount: reviews.length
      });
      
      return acc;
    }, []);
    
    return NextResponse.json({
      metrics,
      period: {
        start: startDate,
        end: endDate
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate staff report' }, { status: 500 });
  }
} 