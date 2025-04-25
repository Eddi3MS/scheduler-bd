import mongoose, { Schema } from 'mongoose'
import { IUser } from '../interfaces/IUser'

const UserSchema: Schema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client',
  },
})

export default mongoose.models.UserSchema ||
  mongoose.model<IUser>('User', UserSchema)
