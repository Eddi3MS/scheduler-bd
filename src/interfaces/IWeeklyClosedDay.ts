import { Document } from 'mongoose'

export interface IWeeklyClosedDay extends Document {
  dayOfWeek: number
}

export interface ICreateWeeklyClosedDay {
  dayOfWeek: number
}
