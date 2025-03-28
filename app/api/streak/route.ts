import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Streak from '@/lib/db/models/Streak';

export async function GET() {
  try {
    await dbConnect();
    
    // Get the streak data
    let streak = await Streak.findOne({});
    
    // If no streak exists, create one with default values
    if (!streak) {
      streak = await Streak.create({
        currentStreak: 0,
        longestStreak: 0,
        lastCheckin: new Date(),
        streakHistory: []
      });
    }
    
    return NextResponse.json(streak);
  } catch (error) {
    console.error('Error fetching streak data:', error);
    return NextResponse.json({ error: 'Failed to fetch streak data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Get the current streak
    let streak = await Streak.findOne({});
    
    if (!streak) {
      // Create new streak if none exists
      streak = await Streak.create({
        currentStreak: 1,
        longestStreak: 1,
        lastCheckin: new Date(),
        streakHistory: [{ date: new Date(), streakCount: 1 }]
      });
    } else {
      // Update existing streak
      const today = new Date();
      const lastCheckin = new Date(streak.lastCheckin);
      
      // Check if last checkin was yesterday
      const isConsecutiveDay = 
        today.getDate() - lastCheckin.getDate() === 1 || 
        (today.getDate() === 1 && lastCheckin.getDate() === new Date(lastCheckin.getFullYear(), lastCheckin.getMonth() + 1, 0).getDate());
      
      if (isConsecutiveDay) {
        streak.currentStreak += 1;
        
        // Update longest streak if needed
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }
      } else if (today.getDate() !== lastCheckin.getDate()) {
        // Reset streak if not consecutive and not same day
        streak.currentStreak = 1;
      }
      
      streak.lastCheckin = today;
      streak.streakHistory.push({ date: today, streakCount: streak.currentStreak });
      
      await streak.save();
    }
    
    return NextResponse.json(streak);
  } catch (error) {
    console.error('Error updating streak:', error);
    return NextResponse.json({ error: 'Failed to update streak' }, { status: 500 });
  }
} 