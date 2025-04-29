import { Document } from 'mongoose'

export interface IWeeklyClosedDay extends Document {
  day: number
}

export interface ICreateWeeklyClosedDay {
  day: number
}
