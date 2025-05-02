import { ICreateProvider, IProvider } from '../interfaces/IProvider'
import Provider from '../models/Provider'

class ProviderService {
  async createOrUpdateProvider({
    userId,
    ...providerData
  }: ICreateProvider): Promise<IProvider> {
    return await Provider.findOneAndUpdate(
      { userId },
      { $set: { ...providerData, userId } },
      { new: true, upsert: true }
    )
  }

  async listProviders(): Promise<IProvider[]> {
    return await Provider.find().populate({
      path: 'userId',
      select: '-password -email',
    })
  }

  async getProviderByUserId(id: string): Promise<IProvider | null> {
    return await Provider.findOne({ userId: id }).populate({
      path: 'userId',
      select: '-password -email',
    })
  }
  async getProviderById(id: string): Promise<IProvider | null> {
    return await Provider.findById(id).populate({
      path: 'userId',
      select: '-password -email',
    })
  }

  async deleteProvider(id: string): Promise<void> {
    await Provider.findByIdAndDelete(id)
  }
}

export default new ProviderService()
