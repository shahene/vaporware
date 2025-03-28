import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import DailyLog from '@/lib/db/models/DailyLog';

export async function GET() {
  try {
    await dbConnect();
    const logs = await DailyLog.find({}).sort({ date: -1 });
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Validate required fields
    if (!data.mood || !data.cravingIntensity) {
      return NextResponse.json(
        { error: 'Mood and craving intensity are required' }, 
        { status: 400 }
      );
    }
    
    // Create new log
    const log = await DailyLog.create({
      date: data.date || new Date(),
      mood: data.mood,
      cravingIntensity: data.cravingIntensity,
      notes: data.notes || '',
      triggers: data.triggers || [],
      activities: data.activities || []
    });
    
    return NextResponse.json(log);
  } catch (error) {
    console.error('Error creating log:', error);
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
} 