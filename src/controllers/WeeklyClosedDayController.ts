import { Request, Response } from 'express'
import weeklyClosedDayService from '../services/WeeklyClosedDayService'

class WeeklyClosedDayController {
  async updateClosedDays(req: Request, res: Response): Promise<Response> {
    const { days } = req.body
    if (!days || !Array.isArray(days) || !days.length)
      return res.status(400).json({ message: 'Invalid parameters' })

    try {
      const weeklyClosedDay =
        await weeklyClosedDayService.createWeeklyClosedDays(days)
      return res.status(201).json(weeklyClosedDay)
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error creating weekly closed day' })
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    const weeklyClosedDays = await weeklyClosedDayService.listWeeklyClosedDays()
    return res.json(weeklyClosedDays)
  }
}

export default new WeeklyClosedDayController()
