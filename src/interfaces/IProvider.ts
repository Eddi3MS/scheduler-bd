import { Document } from 'mongoose'

export interface IProvider extends Document {
  userId: string
  workingHours: { start: string; end: string }[]
  weeklyClosedDays: number[]
  closedDates: string[]
}

export interface ICreateProvider {
  userId: string
  workingHours: { start: string; end: string }[]
  weeklyClosedDays?: number[]
  closedDates?: string[]
}
