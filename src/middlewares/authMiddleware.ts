// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'segredo_super_secreto'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('🚀 ~ token:', req.cookies)
  const token = req.cookies.token
  console.log('🚀 ~ token:', token)

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  try {
    const decoded = jwt.verify(token, SECRET) as Request['user']
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
