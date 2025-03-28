import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  startDate: Date;
  weeklyVapeCost: number;
  monthlyVapeCost: number;
  investmentRate: number;
  investmentYears: number;
}

const UserSchema = new Schema<IUser>({
  startDate: { type: Date, default: Date.now },
  weeklyVapeCost: { type: Number, default: 30 },
  monthlyVapeCost: { type: Number, default: 120 },
  investmentRate: { type: Number, default: 0.07 },
  investmentYears: { type: Number, default: 40 }
}, { timestamps: true });

// Check if the model already exists to prevent overwriting
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 