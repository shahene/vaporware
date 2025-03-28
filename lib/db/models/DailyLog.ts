import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyLog extends Document {
  date: Date;
  mood: string;
  cravingIntensity: number;
  notes: string;
  triggers: string[];
  activities: string[];
}

const DailyLogSchema = new Schema<IDailyLog>({
  date: { type: Date, default: Date.now },
  mood: { type: String, required: true },
  cravingIntensity: { type: Number, required: true },
  notes: { type: String, default: '' },
  triggers: [{ type: String }],
  activities: [{ type: String }]
}, { timestamps: true });

// Check if the model already exists to prevent overwriting
export default mongoose.models.DailyLog || mongoose.model<IDailyLog>('DailyLog', DailyLogSchema); 