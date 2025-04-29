import { IAppointment, ICreateAppointment } from '../interfaces/IAppointment'
import Appointment from '../models/Appointment'
import Break from '../models/Break'
import ClosedDates from '../models/ClosedDates'
import Provider from '../models/Provider'
import Service from '../models/Service'
import WeeklyClosedDay from '../models/WeeklyClosedDay'
import {
  addMinutes,
  formatTime,
  getDayOfWeek,
  getNow,
  hasTimeConflict,
  isToday,
  isValidDateTime,
  parseDateTime,
} from '../utils/dayjs'

class AppointmentService {
  async createAppointment(
    appointmentData: ICreateAppointment
  ): Promise<IAppointment> {
    const { date, time, serviceId, providerId } = appointmentData

    const appointmentDateTime = parseDateTime(date, time)
    if (!isValidDateTime(appointmentDateTime)) {
      throw new Error('Invalid date or time')
    }

    if (appointmentDateTime.isBefore(getNow())) {
      throw new Error('Cannot schedule appointments in the past')
    }

    // Check weekly closed days (e.g., Sundays)
    const dayOfWeek = getDayOfWeek(date)
    const weeklyClosed = await WeeklyClosedDay.findOne({ dayOfWeek })
    if (weeklyClosed) {
      throw new Error('Provider is closed on this day of the week')
    }

    // Check specific closed days (e.g., holidays)
    const closedDay = await ClosedDates.findOne({ date })
    if (closedDay) {
      throw new Error('Provider is closed on this day')
    }

    const service = await Service.findById(serviceId)
    if (!service) {
      throw new Error('Service not found')
    }

    const start = appointmentDateTime
    const end = addMinutes(start, service.duration)

    const provider = await Provider.findById(providerId)
    if (!provider) {
      throw new Error('Provider not found')
    }

    const workingHours = provider.workingHours

    const withinWorkingHours = workingHours.some((period: any) => {
      const periodStart = parseDateTime(date, period.start)
      const periodEnd = parseDateTime(date, period.end)

      return start.isSameOrAfter(periodStart) && end.isSameOrBefore(periodEnd)
    })

    if (!withinWorkingHours) {
      throw new Error('Appointment time is outside provider working hours')
    }

    // Check provider breaks
    const breaks = await Break.find({ providerId, date })
    const onBreak = breaks.some((b) => {
      const breakStart = parseDateTime(date, b.start)
      const breakEnd = parseDateTime(date, b.end)
      return hasTimeConflict(start, end, breakStart, breakEnd)
    })
    if (onBreak) {
      throw new Error('Time slot conflicts with provider break')
    }

    // Check appointment conflicts
    const dayAppointments = await Appointment.find({
      date,
      providerId,
    }).populate('serviceId')
    const conflict = dayAppointments.some((a) => {
      const appStart = parseDateTime(a.date, a.time)
      const appEnd = addMinutes(appStart, (a.serviceId as any).duration)
      return hasTimeConflict(start, end, appStart, appEnd)
    })

    if (conflict) {
      throw new Error('Time slot conflicts with another appointment')
    }

    const newAppointment = new Appointment(appointmentData)
    return await newAppointment.save()
  }

  async listAppointments(): Promise<IAppointment[]> {
    return await Appointment.find({ canceled: false }).populate(
      'serviceId providerId clientId'
    )
  }

  async listFutureAppointments(): Promise<IAppointment[]> {
    const today = new Date().toISOString().split('T')[0]
    return await Appointment.find({
      date: { $gte: today },
      canceled: false,
    }).populate('serviceId providerId clientId')
  }

  async listOwnAppointments(clientId: string): Promise<IAppointment[]> {
    return await Appointment.find({
      clientId,
      canceled: false,
    }).populate('serviceId providerId')
  }

  async getAvailableTimes(
    serviceId: string,
    providerId: string,
    date: string
  ): Promise<string[]> {
    // Verifica se o dia é fechado
    const dayOfWeek = getDayOfWeek(date)
    const isWeeklyClosed = await WeeklyClosedDay.findOne({ dayOfWeek })
    const isClosedDay = await ClosedDates.findOne({ date })
    if (isWeeklyClosed || isClosedDay) return []

    const service = await Service.findById(serviceId)
    if (!service) throw new Error('Service not found')

    const duration = service.duration // in minutes

    // Obter os horários de trabalho do barbeiro
    const provider = await Provider.findById(providerId)
    if (!provider) throw new Error('provider not found')

    const workingHours = provider.workingHours

    const breaks = await Break.find({ providerId, date })
    const appointments = await Appointment.find({ providerId, date }).populate(
      'serviceId'
    )

    const availableSlots: string[] = []

    for (const period of workingHours) {
      let current = parseDateTime(date, period.start)

      const end = parseDateTime(date, period.end)

      while (addMinutes(current, duration).isSameOrBefore(end)) {
        const startTime = current.clone()
        const endTime = addMinutes(current, duration)

        // Verifica conflitos com appointments
        const hasConflict = appointments.some((a) => {
          const appStart = parseDateTime(a.date, a.time)
          const appEnd = addMinutes(appStart, (a.serviceId as any).duration)

          return startTime.isBefore(appEnd) && endTime.isAfter(appStart)
        })

        // Verifica conflitos com breaks
        const inBreak = breaks.some((b) => {
          const breakStart = parseDateTime(date, b.start)
          const breakEnd = parseDateTime(date, b.end)

          return startTime.isBefore(breakEnd) && endTime.isAfter(breakStart)
        })

        if (
          (!isToday(date) || startTime.isAfter(getNow())) &&
          !hasConflict &&
          !inBreak
        ) {
          availableSlots.push(formatTime(startTime))
        }

        current = addMinutes(current, duration)
      }
    }

    return availableSlots
  }

  async cancelAppointment(id: string): Promise<void> {
    const updated = await Appointment.findByIdAndUpdate(
      id,
      { canceled: true },
      { new: true }
    )

    if (!updated) {
      throw new Error('Appointment not found')
    }
  }
}

export default new AppointmentService()
