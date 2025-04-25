import mongoose, { Schema } from 'mongoose'
import { IProvider } from '../interfaces/IProvider'

const ProviderSchema: Schema = new Schema({
  name: { type: String, required: true },
  workingHours: [
    {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
  ],
})

export default mongoose.models.ProviderSchema ||
  mongoose.model<IProvider>('Provider', ProviderSchema)
