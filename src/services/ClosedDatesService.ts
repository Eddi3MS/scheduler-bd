import { IClosedDates, ICreateClosedDates } from '../interfaces/IClosedDates'
import ClosedDates from '../models/ClosedDates'

class ClosedDatesService {
  async insertClosedDates(
    closedDatesData: ICreateClosedDates[]
  ): Promise<IClosedDates[]> {
    await ClosedDates.deleteMany({})

    return await ClosedDates.insertMany(closedDatesData)
  }

  async listClosedDates(): Promise<IClosedDates[]> {
    const today = new Date().toISOString().split('T')[0]

    return await ClosedDates.find({
      date: { $gte: today },
    })
  }
}

export default new ClosedDatesService()
