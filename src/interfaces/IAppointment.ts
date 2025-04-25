import { Document } from 'mongoose'

export interface IAppointment extends Document {
  clientName: string
  email: string
  date: string
  time: string
  serviceId: string
  providerId: string
}

export interface ICreateAppointment {
  clientName: string
  email: string
  date: string
  time: string
  serviceId: string
  providerId: string
}
