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
})

export default mongoose.models.ProviderSchema ||
  mongoose.model<IProvider>('Provider', ProviderSchema)
