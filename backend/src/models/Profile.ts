import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  age: number;
  gender: string;
  country: string;
  sleepHours: number;
  interests: string[];
  stressors: string[];
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, default: '' },
    age: { type: Number, default: 0 },
    gender: { type: String, default: 'Prefer not to say' },
    country: { type: String, default: '' },
    sleepHours: { type: Number, default: 8 },
    interests: { type: [String], default: [] },
    stressors: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>('Profile', ProfileSchema);
