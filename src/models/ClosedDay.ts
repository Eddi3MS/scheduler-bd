import mongoose, { Schema } from 'mongoose'
import { IClosedDay } from '../interfaces/IClosedDay'

const ClosedDaySchema: Schema = new Schema({
  date: { type: String, required: true },
})

export default mongoose.models.ClosedDaySchema ||
  mongoose.model<IClosedDay>('ClosedDay', ClosedDaySchema)
