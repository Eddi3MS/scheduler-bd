import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './config/db'
import routes from './routes'
import { errorMiddleware } from './middlewares/errorMiddleware'
import cookieParser from 'cookie-parser'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 3000

// Database connection
connectDB()

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    credentials: true,
  })
)

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// API Routes
app.use('/api', routes)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  })
})

// Error Handling Middleware (should be last)
app.use(errorMiddleware)

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`Unhandled Rejection: ${err.message}`)
  server.close(() => process.exit(1))
})

export default app
