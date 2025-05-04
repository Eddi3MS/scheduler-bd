import { Request, Response } from 'express'
import providerService from '../services/ProviderService'
import { isValidObjectId, isValidTime } from '../utils/validators'

class ProviderController {
  async createOrUpdate(req: Request, res: Response): Promise<Response> {
    const { workingHours, weeklyClosedDays, closedDates } = req.body
    const userId = req.user?.id
    const image = req.file ? `/uploads/${req.file.filename}` : ''

    if (!userId || !isValidObjectId(userId))
      return res.status(400).json({ message: 'UserId é obrigatório' })

    if (!workingHours || workingHours.length === 0) {
      return res.status(400).json({ message: 'Horário é obrigatório' })
    }

    const isValidWorkingHours = workingHours.every(
      (wh: { start: string; end: string }) =>
        isValidTime(wh.start) && isValidTime(wh.end)
    )

    if (!isValidWorkingHours) {
      return res.status(400).json({ message: 'Horário inválido.' })
    }

    try {
      const provider = await providerService.createOrUpdateProvider({
        userId,
        workingHours,
        closedDates,
        weeklyClosedDays,
        image,
      })
      return res.status(201).json(provider)
    } catch (error) {
      return res.status(500).json({ message: 'Erro criando provider' })
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const providers = await providerService.listProviders()
      return res.json(providers)
    } catch (error) {
      return res.status(500).json({ message: 'Erro listando providers' })
    }
  }

  async getByUserId(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(500).json({ message: 'Parâmetros inválidos' })
    }

    try {
      const provider = await providerService.getProviderByUserId(id)
      return res.json(provider)
    } catch (error) {
      return res.status(500).json({ message: 'Erro listando provider' })
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(500).json({ message: 'Parâmetros inválidos' })
    }

    try {
      const provider = await providerService.getProviderById(id)
      return res.json(provider)
    } catch (error) {
      return res.status(500).json({ message: 'Erro listando provider' })
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Id é obrigatório' })
    }

    try {
      await providerService.deleteProvider(id)
      return res.sendStatus(204)
    } catch (error) {
      return res.status(500).json({ message: 'Erro deletando provider' })
    }
  }
}

export default new ProviderController()
