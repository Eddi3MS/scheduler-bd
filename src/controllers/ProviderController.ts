import { Request, Response } from 'express'
import providerService from '../services/ProviderService'
import { isValidObjectId, isValidTime } from '../utils/validators'

class ProviderController {
  async create(req: Request, res: Response): Promise<Response> {
    const { userId, workingHours } = req.body

    if (!userId || !isValidObjectId(userId))
      return res.status(400).json({ message: 'UserId is required' })
    if (!workingHours || workingHours.length === 0) {
      return res.status(400).json({ message: 'Working hours are required' })
    }

    // Valida se os horários de trabalho estão no formato correto
    const isValidWorkingHours = workingHours.every(
      (wh: { start: string; end: string }) =>
        isValidTime(wh.start) && isValidTime(wh.end)
    )

    if (!isValidWorkingHours) {
      return res.status(400).json({ message: 'Invalid working hours format' })
    }

    try {
      const provider = await providerService.createProvider({
        userId,
        workingHours,
      })
      return res.status(201).json(provider)
    } catch (error) {
      return res.status(500).json({ message: 'Error creating provider' })
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const providers = await providerService.listProviders()
      return res.json(providers)
    } catch (error) {
      return res.status(500).json({ message: 'Error listing providers' })
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(500).json({ message: 'Invalid parameters' })
    }

    try {
      const provider = await providerService.getProviderById(id)
      return res.json(provider)
    } catch (error) {
      return res.status(500).json({ message: 'Error listing provider' })
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { workingHours } = req.body

    if (!workingHours) {
      return res.status(400).json({ message: 'Parâmetros inválidos' })
    }

    // Se horas de trabalho são fornecidas, valida o formato
    if (workingHours && workingHours.length > 0) {
      const isValidWorkingHours = workingHours.every(
        (wh: { start: string; end: string }) =>
          isValidTime(wh.start) && isValidTime(wh.end)
      )

      if (!isValidWorkingHours) {
        return res.status(400).json({ message: 'Parâmetros inválidos' })
      }
    }

    try {
      const updated = await providerService.updateProvider(id, {
        workingHours,
      })
      return res.json(updated)
    } catch (error) {
      return res.status(500).json({ message: 'Error updating provider' })
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    try {
      await providerService.deleteProvider(id)
      return res.sendStatus(204)
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting provider' })
    }
  }
}

export default new ProviderController()
