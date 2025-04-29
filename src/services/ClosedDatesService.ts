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
    return await ClosedDates.find()
  }
}

export default new ClosedDatesService()
