import ClosedDay from '../models/ClosedDay'
import { IClosedDay, ICreateClosedDay } from '../interfaces/IClosedDay'
import { isValidObjectId } from '../utils/validators'

class ClosedDayService {
  async createClosedDay(closedDayData: ICreateClosedDay): Promise<IClosedDay> {
    const closedDay = new ClosedDay(closedDayData)
    return await closedDay.save()
  }

  async listClosedDays(): Promise<IClosedDay[]> {
    return await ClosedDay.find()
  }

  async deleteClosedDay(id: string): Promise<void> {
    if (!isValidObjectId(id)) throw new Error('Invalid ID')
    await ClosedDay.findByIdAndDelete(id)
  }
}

export default new ClosedDayService()
