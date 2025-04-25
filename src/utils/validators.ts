import mongoose from 'mongoose'

/**
 * Validate if a string is a valid MongoDB ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id)
}

/**
 * Validate phone number format (basic validation)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/
  return phoneRegex.test(phone)
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDate = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) return false

  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

/**
 * Validate time format (HH:MM in 24-hour format)
 */
export const isValidTime = (timeString: string): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
  return timeRegex.test(timeString)
}

/**
 * Validate if a time slot is in the future
 */
export const isFutureDateTime = (date: string, time: string): boolean => {
  const appointmentDateTime = new Date(`${date}T${time}:00`)
  const now = new Date()
  return appointmentDateTime > now
}

/**
 * Validate service duration (in minutes)
 */
export const isValidDuration = (duration: number): boolean => {
  return Number.isInteger(duration) && duration > 0 && duration <= 240 // Max 4 hours
}

/**
 * Validate day of week (0-6 where 0 is Sunday)
 */
export const isValidDayOfWeek = (day: number): boolean => {
  return Number.isInteger(day) && day >= 0 && day <= 6
}

export default {
  isValidObjectId,
  isValidPhoneNumber,
  isValidDate,
  isValidTime,
  isFutureDateTime,
  isValidDuration,
  isValidDayOfWeek,
}
