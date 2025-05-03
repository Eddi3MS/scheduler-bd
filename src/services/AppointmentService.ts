import { IAppointment, ICreateAppointment } from '../interfaces/IAppointment'
import Appointment from '../models/Appointment'
import Provider from '../models/Provider'
import Service from '../models/Service'
import { notifyProvider } from '../routes/sse'

import {
  addMinutes,
  formatTime,
  getDayOfWeek,
  getNow,
  getTodayStr,
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

    const provider = await Provider.findById(providerId)
    if (!provider) {
      throw new Error('Provider not found')
    }

    // Check weekly closed days (e.g., Sundays)
    const dayOfWeek = getDayOfWeek(date)
    const weeklyClosed = provider.weeklyClosedDays.includes(dayOfWeek)
    if (weeklyClosed) {
      throw new Error('Provider não trabalha neste dia.')
    }

    // Check specific closed days (e.g., holidays)
    const closedDay = provider.closedDates.includes(date)
    if (closedDay) {
      throw new Error('Provider is closed on this day')
    }

    const service = await Service.findById(serviceId)
    if (!service) {
      throw new Error('Service not found')
    }

    const start = appointmentDateTime
    const end = addMinutes(start, service.duration)

    const workingHours = provider.workingHours

    const withinWorkingHours = workingHours.some((period: any) => {
      const periodStart = parseDateTime(date, period.start)
      const periodEnd = parseDateTime(date, period.end)

      return start.isSameOrAfter(periodStart) && end.isSameOrBefore(periodEnd)
    })

    if (!withinWorkingHours) {
      throw new Error('Appointment time is outside provider working hours')
    }

    // Check appointment conflicts
    const dayAppointments = await Appointment.find({
      date,
      providerId,
      canceled: false,
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

    const appointment = await newAppointment.save()

    if (isToday(appointment.date)) {
      const appointmentToProvider = await appointment.populate([
        'serviceId',
        'clientId',
      ])

      notifyProvider(providerId, {
        status: 'created',
        data: appointmentToProvider,
      })
    }

    return appointment
  }

  async listAppointments(): Promise<IAppointment[]> {
    return await Appointment.find()
      .populate('serviceId providerId clientId')
      .populate([
        { path: 'serviceId' },
        {
          path: 'providerId',
          populate: {
            path: 'clientId',
            select: '-password',
          },
        },
      ])
      .sort({ date: -1, time: -1 })
  }

  async listProviderAppointments(providerId: string): Promise<IAppointment[]> {
    const todayStr = getTodayStr()
    return await Appointment.find({
      providerId,
      date: todayStr,
    })
      .populate('serviceId clientId')
      .populate([
        { path: 'serviceId' },
        {
          path: 'clientId',

          select: '-password',
        },
      ])
      .sort({ date: -1, time: -1 })
  }

  async listFutureAppointments(): Promise<IAppointment[]> {
    const todayStr = getTodayStr()
    return await Appointment.find({
      date: { $gte: todayStr },
    })
      .populate([
        { path: 'serviceId' },
        {
          path: 'providerId',
          populate: {
            path: 'clientId',
            select: '-password',
          },
        },
      ])
      .sort({ date: -1, time: -1 })
  }

  async listOwnAppointments(clientId: string): Promise<IAppointment[]> {
    return await Appointment.find({ clientId })
      .populate([
        { path: 'serviceId' },
        {
          path: 'providerId',
          populate: {
            path: 'userId',
            select: '-password',
          },
        },
      ])
      .sort({ date: -1, time: -1 })
  }

  async getAvailableTimes(
    serviceId: string,
    providerId: string,
    date: string
  ): Promise<string[]> {
    const provider = await Provider.findById(providerId)
    if (!provider) throw new Error('Provider not found')

    const dayOfWeek = getDayOfWeek(date)
    if (
      provider.weeklyClosedDays.includes(dayOfWeek) ||
      provider.closedDates.includes(date)
    ) {
      return []
    }

    const service = await Service.findById(serviceId)
    if (!service) throw new Error('Service not found')

    const duration = service.duration

    const appointments = await Appointment.find({
      providerId,
      date,
      canceled: false,
    }).populate('serviceId')

    // Bloqueios: início + duração + buffer
    const blockedPeriods = appointments
      .map((a) => {
        const start = parseDateTime(a.date, a.time) // deve retornar um dayjs
        const end = start.add((a.serviceId as any).duration, 'minute')
        return { start, end }
      })
      .sort((a, b) => a.start.diff(b.start))

    const freeIntervals = []

    for (const period of provider.workingHours) {
      let windowStart = parseDateTime(date, period.start)
      const windowEnd = parseDateTime(date, period.end)

      for (const blocked of blockedPeriods) {
        if (blocked.start.isSameOrAfter(windowEnd)) break
        if (blocked.end.isSameOrBefore(windowStart)) continue

        if (blocked.start.isAfter(windowStart)) {
          freeIntervals.push({ start: windowStart, end: blocked.start })
        }

        windowStart = windowStart.isAfter(blocked.end)
          ? windowStart
          : blocked.end
      }

      if (windowStart.isBefore(windowEnd)) {
        freeIntervals.push({ start: windowStart, end: windowEnd })
      }
    }

    const availableSlots: string[] = []

    for (const interval of freeIntervals) {
      let current = interval.start

      while (current.add(duration, 'minute').isSameOrBefore(interval.end)) {
        const startTime = current
        const endTime = current.add(duration, 'minute')

        if (isToday(date) && startTime.isBefore(getNow())) {
          current = current.add(duration, 'minute')
          continue
        }

        const hasConflict = blockedPeriods.some(
          ({ start, end }) => startTime.isBefore(end) && endTime.isAfter(start)
        )

        if (!hasConflict) {
          availableSlots.push(formatTime(startTime))
        }

        current = current.add(duration, 'minute')
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

    const appointmentToProvider = await updated.populate([
      'serviceId',
      'clientId',
    ])

    if (isToday(updated.date)) {
      notifyProvider(updated.providerId.toString(), {
        status: 'canceled',
        data: appointmentToProvider.toObject(),
      })
    }
  }
}

export default new AppointmentService()
