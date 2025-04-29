import mongoose, { Schema } from 'mongoose'
import { IClosedDates } from '../interfaces/IClosedDates'

const ClosedDatesSchema: Schema = new Schema({
  date: { type: String, required: true },
})

export default mongoose.models.ClosedDatesSchema ||
  mongoose.model<IClosedDates>('ClosedDates', ClosedDatesSchema)
