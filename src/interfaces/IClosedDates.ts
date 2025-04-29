import { Document } from 'mongoose'

export interface IClosedDates extends Document {
  date: string
}

export interface ICreateClosedDates {
  date: string
}
