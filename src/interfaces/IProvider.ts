import { Document } from 'mongoose'

export interface IProvider extends Document {
  name: string
  workingHours: { start: string; end: string }[]
}

export interface ICreateProvider {
  name: string
  workingHours: { start: string; end: string }[]
}
