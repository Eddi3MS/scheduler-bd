import { Request, Response } from 'express'
import breakService from '../services/BreakService'

class BreakController {
  async create(req: Request, res: Response): Promise<Response> {
    const { providerId, date, start, end } = req.body

    if (!providerId || !date || !start || !end) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    try {
      const newBreak = await breakService.createBreak({
        providerId,
        date,
        start,
        end,
      })
      return res.status(201).json(newBreak)
    } catch (error) {
      return res.status(500).json({ message: 'Error creating break' })
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    const breaks = await breakService.listBreaks()
    return res.json(breaks)
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    await breakService.deleteBreak(id)
    return res.sendStatus(204)
  }
}

export default new BreakController()
