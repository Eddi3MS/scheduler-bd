import { Request, Response } from 'express'
import appointmentService from '../services/AppointmentService'
import { isValidObjectId } from '../utils/validators'
import Provider from '../models/Provider'

class AppointmentController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { date, time, serviceId, providerId } = req.body

      const clientId = req.user?.id

      if (!clientId || !date || !time || !serviceId || !providerId) {
        return res.status(400).json({
          message:
            'All fields are required: clientId, date, time, serviceId, providerId',
        })
      }

      if (
        !isValidObjectId(serviceId) ||
        !isValidObjectId(providerId) ||
        !isValidObjectId(clientId)
      ) {
        return res
          .status(400)
          .json({ message: 'Invalid serviceId or providerId' })
      }

      const appointment = await appointmentService.createAppointment({
        date,
        time,
        serviceId,
        providerId,
        clientId,
      })

      return res.status(201).json(appointment)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async listOwn(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId || !isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid userId' })
      }
      const appointments = await appointmentService.listOwnAppointments(userId)
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

  async listProviderAppointments(
    req: Request,
    res: Response
  ): Promise<Response> {
    const userId = req?.user?.id

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({ message: 'Não autorizado.' })
    }
    try {
      const provider = await Provider.findOne({ userId })

      if (!provider) {
        return res.status(400).json({ message: 'Provider não encontrado.' })
      }

      const appointments = await appointmentService.listProviderAppointments(
        provider._id
      )
      return res.json(appointments)
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to fetch appointments' })
    }
  }

  async listProviderFutureAppointments(
    req: Request,
    res: Response
  ): Promise<Response> {
    const userId = req?.user?.id

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({ message: 'Não autorizado.' })
    }
    try {
      const provider = await Provider.findOne({ userId })

      if (!provider) {
        return res.status(400).json({ message: 'Provider não encontrado.' })
      }

      const appointments =
        await appointmentService.listProviderFutureAppointments(provider._id)
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

  async getAvailableTime(req: Request, res: Response): Promise<Response> {
    try {
      const serviceId = req.query.serviceId as string
      const providerId = req.query.providerId as string
      const date = req.query.date as string

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
