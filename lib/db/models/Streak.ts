import mongoose, { Schema, Document } from 'mongoose';

interface IStreakHistory {
  date: Date;
  streakCount: number;
}

export interface IStreak extends Document {
  currentStreak: number;
  longestStreak: number;
  lastCheckin: Date;
  streakHistory: IStreakHistory[];
}

const StreakHistorySchema = new Schema<IStreakHistory>({
  date: { type: Date, required: true },
  streakCount: { type: Number, required: true }
});

const StreakSchema = new Schema<IStreak>({
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastCheckin: { type: Date, default: Date.now },
  streakHistory: [StreakHistorySchema]
}, { timestamps: true });

// Check if the model already exists to prevent overwriting
export default mongoose.models.Streak || mongoose.model<IStreak>('Streak', StreakSchema); 