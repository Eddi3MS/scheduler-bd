// types/express/index.d.ts (declarando globalmente)
import 'express'
import { Role } from '../../interfaces/IUser'

declare module 'express' {
  interface Request {
    user?: {
      _id: string
      email: string
      role: Role
    }
  }
}
