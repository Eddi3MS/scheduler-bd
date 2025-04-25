import { Document } from 'mongoose'

export const ROLES = ['admin', 'client'] as const
export type Role = (typeof ROLES)[number]

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: Role
}

export interface ICreateUser {
  name: string
  email: string
  password: string
}
