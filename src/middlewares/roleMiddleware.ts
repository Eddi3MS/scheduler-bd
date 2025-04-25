import { Request, Response, NextFunction } from 'express'
import { Role } from '../interfaces/IUser'

export function roleMiddleware(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado' })
    }
    next()
  }
}
