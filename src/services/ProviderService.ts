import Provider from '../models/Provider'
import { IProvider, ICreateProvider } from '../interfaces/IProvider'
import { isValidObjectId } from '../utils/validators'

class ProviderService {
  async createProvider(providerData: ICreateProvider): Promise<IProvider> {
    const provider = new Provider(providerData)
    return await provider.save()
  }

  async listProviders(): Promise<IProvider[]> {
    return await Provider.find()
  }

  async getProviderById(id: string): Promise<IProvider[] | null> {
    return await Provider.findById(id)
  }

  async updateProvider(
    id: string,
    providerData: Partial<ICreateProvider>
  ): Promise<IProvider | null> {
    if (!isValidObjectId(id)) throw new Error('Invalid ID')
    return await Provider.findByIdAndUpdate(id, providerData, { new: true })
  }

  async deleteProvider(id: string): Promise<void> {
    if (!isValidObjectId(id)) throw new Error('Invalid ID')
    await Provider.findByIdAndDelete(id)
  }
}

export default new ProviderService()
