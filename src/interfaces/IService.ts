import { Document } from 'mongoose'

export interface IService extends Document {
  name: string
  duration: number
  providerId: string
  price: number
  image?: String
  isDeleted: boolean
}

export interface ICreateService {
  name: string
  duration: number
  providerId: string
  price: number
  image?: string
}
