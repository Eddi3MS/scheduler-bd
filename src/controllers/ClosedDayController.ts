import { Request, Response } from 'express'
import closedDayService from '../services/ClosedDayService'

class ClosedDayController {
  async create(req: Request, res: Response): Promise<Response> {
    const { date } = req.body
    if (!date) return res.status(400).json({ message: 'Date is required' })

    try {
      const closedDay = await closedDayService.createClosedDay({ date })
      return res.status(201).json(closedDay)
    } catch (error) {
      return res.status(500).json({ message: 'Error creating closed day' })
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    const closedDays = await closedDayService.listClosedDays()
    return res.json(closedDays)
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    await closedDayService.deleteClosedDay(id)
    return res.sendStatus(204)
  }
}

export default new ClosedDayController()
