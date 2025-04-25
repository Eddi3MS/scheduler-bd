import { Document } from 'mongoose'

export interface IBreak extends Document {
  providerId: string
  date: string
  start: string
  end: string
}

export interface ICreateBreak {
  providerId: string
  date: string
  start: string
  end: string
}
