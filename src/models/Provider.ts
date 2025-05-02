import mongoose, { Schema } from 'mongoose'
import { IProvider } from '../interfaces/IProvider'

const ProviderSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  workingHours: [
    {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
  ],
  weeklyClosedDays: [
    { type: Number, min: 0, max: 6 }, // 0 = domingo, 6 = sábado
  ],

  closedDates: [
    { type: String }, // formato ISO (ex: "2025-05-02")
  ],
})

export default mongoose.models.ProviderSchema ||
  mongoose.model<IProvider>('Provider', ProviderSchema)
