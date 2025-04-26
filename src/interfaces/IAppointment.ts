import { Document } from 'mongoose'

export interface IAppointment extends Document {
  date: string
  time: string
  serviceId: string
  providerId: string
  clientId: string
}

export interface ICreateAppointment {
  date: string
  time: string
  serviceId: string
  providerId: string
  clientId: string
}
