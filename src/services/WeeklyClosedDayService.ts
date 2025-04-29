import {
  ICreateWeeklyClosedDay,
  IWeeklyClosedDay,
} from '../interfaces/IWeeklyClosedDay'
import WeeklyClosedDay from '../models/WeeklyClosedDay'

class WeeklyClosedDayService {
  async createWeeklyClosedDays(
    days: ICreateWeeklyClosedDay[]
  ): Promise<IWeeklyClosedDay[]> {
    await WeeklyClosedDay.deleteMany({})

    return await WeeklyClosedDay.insertMany(days)
  }

  async listWeeklyClosedDays(): Promise<IWeeklyClosedDay[]> {
    return await WeeklyClosedDay.find()
  }
}

export default new WeeklyClosedDayService()
