import mongoose, { Schema } from 'mongoose'
import { IBreak } from '../interfaces/IBreak'

const BreakSchema: Schema = new Schema({
  providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
  date: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
})

export default mongoose.models.BreakSchema ||
  mongoose.model<IBreak>('Break', BreakSchema)
