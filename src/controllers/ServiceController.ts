import { Request, Response } from 'express'
import serviceService from '../services/ServiceService'
import { isValidObjectId } from '../utils/validators'

class ServiceController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, duration, providerId, price } = req.body
    if (!name || !duration || !price || !isValidObjectId(providerId)) {
      return res
        .status(400)
        .json({ message: 'Name, providerId and duration are required' })
    }

    try {
      const service = await serviceService.createService({
        name,
        duration,
        providerId,
        price,
      })
      return res.status(201).json(service)
    } catch (error) {
      return res.status(500).json({ message: 'Error creating service' })
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    const { providerId } = req.body
    if (!isValidObjectId(providerId)) {
      return res.status(400).json({ message: 'ProviderId is required' })
    }
    const services = await serviceService.listServices(providerId)
    return res.json(services)
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { name, duration, price } = req.body

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid Parameters' })
    }

    if (!name && !duration && !price) {
      return res
        .status(400)
        .json({ message: 'Name, price or duration are required' })
    }

    try {
      const updated = await serviceService.updateService(id, {
        name,
        duration,
        price,
      })
      return res.json(updated)
    } catch (error) {
      return res.status(500).json({ message: 'Error updating service' })
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Id is required' })
    }

    await serviceService.deleteService(id)
    return res.sendStatus(204)
  }
}

export default new ServiceController()
