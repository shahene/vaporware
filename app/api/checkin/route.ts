import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Streak from '@/lib/db/models/Streak';
import DailyLog from '@/lib/db/models/DailyLog';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Create the daily log
    const log = await DailyLog.create({
      date: data.date || new Date(),
      mood: data.mood,
      cravingIntensity: data.cravingIntensity,
      notes: data.notes || '',
      triggers: data.triggers || [],
      activities: data.activities || []
    });
    
    // Update streak
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
      
      // Check if last checkin was yesterday or today
      const isConsecutiveDay = 
        (today.getDate() - lastCheckin.getDate() === 1 && 
         today.getMonth() === lastCheckin.getMonth() && 
         today.getFullYear() === lastCheckin.getFullYear()) || 
        (today.getDate() === lastCheckin.getDate() && 
         today.getMonth() === lastCheckin.getMonth() && 
         today.getFullYear() === lastCheckin.getFullYear());
      
      if (isConsecutiveDay) {
        // Only increment if not already checked in today
        if (today.getDate() !== lastCheckin.getDate()) {
          streak.currentStreak += 1;
          
          // Update longest streak if needed
          if (streak.currentStreak > streak.longestStreak) {
            streak.longestStreak = streak.currentStreak;
          }
        }
      } else {
        // Reset streak if not consecutive
        streak.currentStreak = 1;
      }
      
      streak.lastCheckin = today;
      
      // Only add to history if not already checked in today
      if (today.getDate() !== lastCheckin.getDate() || 
          today.getMonth() !== lastCheckin.getMonth() || 
          today.getFullYear() !== lastCheckin.getFullYear()) {
        streak.streakHistory.push({ date: today, streakCount: streak.currentStreak });
      }
      
      await streak.save();
    }
    
    return NextResponse.json({ log, streak });
  } catch (error) {
    console.error('Error updating streak:', error);
    return NextResponse.json({ error: 'Failed to update streak' }, { status: 500 });
  }
} 