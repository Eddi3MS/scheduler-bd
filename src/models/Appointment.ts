import mongoose, { Schema } from 'mongoose'
import { IAppointment } from '../interfaces/IAppointment'

const AppointmentSchema: Schema = new Schema({
  clientName: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
  canceled: { type: Boolean, default: false },
})

export default mongoose.models.AppointmentSchema ||
  mongoose.model<IAppointment>('Appointment', AppointmentSchema)
