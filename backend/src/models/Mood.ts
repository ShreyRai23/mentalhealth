import mongoose, { Document, Schema } from 'mongoose';

export interface IMood extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  emoji: string;
  date: Date;
}

const MoodSchema = new Schema<IMood>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Mood name is required'],
      trim: true,
    },
    emoji: {
      type: String,
      required: [true, 'Mood emoji is required'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMood>('Mood', MoodSchema);
