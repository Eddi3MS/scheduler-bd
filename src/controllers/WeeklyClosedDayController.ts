import { Request, Response } from 'express'
import weeklyClosedDayService from '../services/WeeklyClosedDayService'

class WeeklyClosedDayController {
  async create(req: Request, res: Response): Promise<Response> {
    const { dayOfWeek } = req.body
    if (!dayOfWeek)
      return res.status(400).json({ message: 'Day of week is required' })

    try {
      const weeklyClosedDay =
        await weeklyClosedDayService.createWeeklyClosedDay({ dayOfWeek })
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

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    await weeklyClosedDayService.deleteWeeklyClosedDay(id)
    return res.sendStatus(204)
  }
}

export default new WeeklyClosedDayController()
