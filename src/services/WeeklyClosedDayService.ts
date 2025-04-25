import WeeklyClosedDay from '../models/WeeklyClosedDay'
import {
  ICreateWeeklyClosedDay,
  IWeeklyClosedDay,
} from '../interfaces/IWeeklyClosedDay'
import { isValidObjectId } from '../utils/validators'

class WeeklyClosedDayService {
  async createWeeklyClosedDay(
    weeklyClosedDayData: ICreateWeeklyClosedDay
  ): Promise<IWeeklyClosedDay> {
    const weeklyClosedDay = new WeeklyClosedDay(weeklyClosedDayData)
    return await weeklyClosedDay.save()
  }

  async listWeeklyClosedDays(): Promise<IWeeklyClosedDay[]> {
    return await WeeklyClosedDay.find()
  }

  async deleteWeeklyClosedDay(id: string): Promise<void> {
    if (!isValidObjectId(id)) throw new Error('Invalid ID')
    await WeeklyClosedDay.findByIdAndDelete(id)
  }
}

export default new WeeklyClosedDayService()
