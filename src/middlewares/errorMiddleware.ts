import { Request, Response, NextFunction } from 'express'
import { MongoServerError } from 'mongodb'
import { JsonWebTokenError } from 'jsonwebtoken'

interface AppError extends Error {
  statusCode?: number
  code?: number
  errors?: Record<string, { message: string }>
}

class CustomAPIError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 400) {
    super(message)
    this.statusCode = statusCode
    Object.setPrototypeOf(this, CustomAPIError.prototype)
  }
}

const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('[Error Handler]', err)

  let error = { ...err }
  error.message = err.message

  // Default status code
  let statusCode = err.statusCode || 500
  let message = err.message || 'Server Error'

  // Handle specific error types
  if (err instanceof CustomAPIError) {
    statusCode = err.statusCode
    message = err.message
  }
  // MongoDB Duplicate Key Error
  else if ((err as MongoServerError).code === 11000) {
    statusCode = 400
    message = 'Duplicate field value entered'
  }
  // MongoDB Validation Error
  else if (err.name === 'ValidationError') {
    statusCode = 400
    const errors = err.errors
      ? Object.values(err.errors).map((el) => el.message)
      : []
    message = `Validation failed: ${errors.join(', ')}`
  }
  // JWT Error
  else if (err instanceof JsonWebTokenError) {
    statusCode = 401
    message = 'Not authorized, token failed'
  }
  // Cast Error (invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 400
    message = `Resource not found with id of ${(err as any).value}`
  }

  // Development vs Production error details
  const errorResponse = {
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    ...(process.env.NODE_ENV === 'development' && { fullError: err }),
  }

  res.status(statusCode).json(errorResponse)
}

export { errorMiddleware, CustomAPIError }
