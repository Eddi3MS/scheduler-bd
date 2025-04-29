import { Request, Response } from 'express'
import closedDatesService from '../services/ClosedDatesService'

class ClosedDatesController {
  async updateClosedDates(req: Request, res: Response): Promise<Response> {
    const { dates } = req.body
    if (!Array.isArray(dates) || dates.length < 1)
      return res.status(400).json({ message: 'Date is required' })

    try {
      const closedDates = await closedDatesService.insertClosedDates(dates)
      return res.status(201).json(closedDates)
    } catch (error) {
      return res.status(500).json({ message: 'Error creating closed dates' })
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const closedDates = await closedDatesService.listClosedDates()
      return res.json(closedDates)
    } catch (error) {
      return res.status(500).json({ message: 'Error listing closed dates' })
    }
  }
}

export default new ClosedDatesController()
