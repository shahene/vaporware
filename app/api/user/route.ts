import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import User from '@/lib/db/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    // Get the user data (assuming single user for now)
    let user = await User.findOne({});
    
    // If no user exists, create one with default values
    if (!user) {
      user = await User.create({
        startDate: new Date(),
        weeklyVapeCost: 30,
        monthlyVapeCost: 120,
        investmentRate: 0.07,
        investmentYears: 40
      });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Get the user
    let user = await User.findOne({});
    
    // If no user exists, create one
    if (!user) {
      user = await User.create({
        ...data,
        startDate: data.startDate || new Date()
      });
    } else {
      // Update existing user
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
          user[key] = data[key];
        }
      });
      
      await user.save();
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 });
  }
} 