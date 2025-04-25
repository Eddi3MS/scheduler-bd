import mongoose, { Schema } from 'mongoose'
import { IService } from '../interfaces/IService'

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
  price: { type: Number, required: true },
})

export default mongoose.models.ServiceSchema ||
  mongoose.model<IService>('Service', ServiceSchema)
