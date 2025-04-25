import mongoose from 'mongoose'
import { initAdmin } from '../utils/initAdmin'

const MONGO_URI = process.env.MONGO_URI

const connectDB = async (): Promise<void> => {
  try {
    if (!MONGO_URI) {
      throw new Error('Missing DB url')
    }
    await mongoose.connect(MONGO_URI)

    await initAdmin()
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error)
})

export default connectDB
