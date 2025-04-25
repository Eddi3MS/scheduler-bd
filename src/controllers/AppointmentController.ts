import { Request, Response } from 'express'
import appointmentService from '../services/AppointmentService'
import { isValidObjectId } from '../utils/validators'

class AppointmentController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { clientName, email, date, time, serviceId, providerId } = req.body

      if (
        !clientName ||
        !email ||
        !date ||
        !time ||
        !serviceId ||
        !providerId
      ) {
        return res.status(400).json({
          message:
            'All fields are required: clientName, email, date, time, serviceId, providerId',
        })
      }

      if (!isValidObjectId(serviceId) || !isValidObjectId(providerId)) {
        return res
          .status(400)
          .json({ message: 'Invalid serviceId or providerId' })
      }

      const appointment = await appointmentService.createAppointment({
        clientName,
        email,
        date,
        time,
        serviceId,
        providerId,
      })

      return res.status(201).json(appointment)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async listOwn(req: Request, res: Response) {
    try {
      const appointments = await appointmentService.listOwnAppointments(
        req.user!.email
      )
      res.json(appointments)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const appointments = await appointmentService.listAppointments()
      return res.json(appointments)
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to fetch appointments' })
    }
  }

  async listFuture(req: Request, res: Response): Promise<Response> {
    try {
      const appointments = await appointmentService.listFutureAppointments()
      return res.json(appointments)
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: 'Failed to fetch future appointments' })
    }
  }

  async listByMail(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.params
      const appointments = await appointmentService.listAppointmentsByMail(
        email
      )
      return res.json(appointments)
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: 'Failed to fetch appointments by email' })
    }
  }

  async getAvailableTime(req: Request, res: Response): Promise<Response> {
    try {
      const { serviceId, providerId, date } = req.body

      if (
        !isValidObjectId(serviceId) ||
        !isValidObjectId(providerId) ||
        !date
      ) {
        return res
          .status(400)
          .json({ message: 'serviceId, providerId and date are required' })
      }

      const availableTimes = await appointmentService.getAvailableTimes(
        serviceId,
        providerId,
        date
      )
      return res.json(availableTimes)
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: 'Failed to fetch available appointments' })
    }
  }

  async cancel(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params

      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid appointment ID' })
      }

      await appointmentService.cancelAppointment(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}

export default new AppointmentController()
