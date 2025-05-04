import { Request, Response } from 'express'
import serviceService from '../services/ServiceService'
import { isValidObjectId } from '../utils/validators'
import Provider from '../models/Provider'

class ServiceController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, duration, providerId, price } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : ''

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
        image,
      })
      return res.status(201).json(service)
    } catch (error) {
      return res.status(500).json({ message: 'Error creating service' })
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    const services = await serviceService.listServices()
    return res.json(services)
  }

  async listOwn(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id
    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Id is required' })
    }

    const provider = await Provider.findOne({ userId })

    if (!provider) {
      return res.status(400).json({ message: 'Provider não encontrado' })
    }
    const services = await serviceService.listOwnServices(provider._id)
    return res.json(services)
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ServiceId is required' })
    }

    const services = await serviceService.getServiceById(id)
    return res.json(services)
  }

  async listByProviderId(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ProviderId is required' })
    }
    const services = await serviceService.listServicesByProvider(id)
    return res.json(services)
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { name, duration, price } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : ''

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
        image,
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
