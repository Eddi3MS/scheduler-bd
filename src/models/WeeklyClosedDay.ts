import mongoose, { Schema } from 'mongoose'
import { IWeeklyClosedDay } from '../interfaces/IWeeklyClosedDay'

const WeeklyClosedDaySchema: Schema = new Schema({
  day: { type: Number, required: true, min: 0, max: 6 },
})

export default mongoose.models.WeeklyClosedDaySchema ||
  mongoose.model<IWeeklyClosedDay>('WeeklyClosedDay', WeeklyClosedDaySchema)
