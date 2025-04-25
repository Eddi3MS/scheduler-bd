import Break from '../models/Break'
import { IBreak, ICreateBreak } from '../interfaces/IBreak'
import { isValidObjectId } from '../utils/validators'

class BreakService {
  async createBreak(breakData: ICreateBreak): Promise<IBreak> {
    const newBreak = new Break(breakData)
    return await newBreak.save()
  }

  async listBreaks(): Promise<IBreak[]> {
    return await Break.find()
  }

  async deleteBreak(id: string): Promise<void> {
    if (!isValidObjectId(id)) throw new Error('Invalid ID')
    await Break.findByIdAndDelete(id)
  }
}

export default new BreakService()
