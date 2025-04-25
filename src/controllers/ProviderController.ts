import { Request, Response } from 'express'
import providerService from '../services/ProviderService'
import { isValidTime } from '../utils/validators'

class ProviderController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, workingHours } = req.body

    if (!name) return res.status(400).json({ message: 'Name is required' })
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
        name,
        workingHours,
      })
      return res.status(201).json(provider)
    } catch (error) {
      return res.status(500).json({ message: 'Error creating provider' })
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    const providers = await providerService.listProviders()
    return res.json(providers)
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { name, workingHours } = req.body

    if (!name && !workingHours) {
      return res
        .status(400)
        .json({ message: 'At least name or working hours are required' })
    }

    // Se horas de trabalho são fornecidas, valida o formato
    if (workingHours && workingHours.length > 0) {
      const isValidWorkingHours = workingHours.every(
        (wh: { start: string; end: string }) =>
          isValidTime(wh.start) && isValidTime(wh.end)
      )

      if (!isValidWorkingHours) {
        return res.status(400).json({ message: 'Invalid working hours format' })
      }
    }

    try {
      const updated = await providerService.updateProvider(id, {
        name,
        workingHours,
      })
      return res.json(updated)
    } catch (error) {
      return res.status(500).json({ message: 'Error updating provider' })
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    await providerService.deleteProvider(id)
    return res.sendStatus(204)
  }
}

export default new ProviderController()
