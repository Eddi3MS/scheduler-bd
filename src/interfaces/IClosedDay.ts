import { Document } from 'mongoose'

export interface IClosedDay extends Document {
  date: string
}

export interface ICreateClosedDay {
  date: string
}
