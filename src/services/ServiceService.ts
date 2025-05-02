import { ICreateService, IService } from '../interfaces/IService'
import Service from '../models/Service'

class ServiceService {
  async createService(serviceData: ICreateService): Promise<IService> {
    const service = new Service(serviceData)
    return await service.save()
  }

  async listServices(): Promise<IService[]> {
    return await Service.find()
  }

  async listOwnServices(providerId: string): Promise<IService[]> {
    return await Service.find({ providerId })
  }

  async getServiceById(id: string): Promise<IService | null> {
    return await Service.findById(id)
  }

  async listServicesByProvider(providerId: string): Promise<IService[]> {
    return await Service.find({
      providerId,
    })
  }

  async updateService(
    id: string,
    serviceData: Partial<ICreateService>
  ): Promise<IService | null> {
    return await Service.findByIdAndUpdate(id, serviceData, { new: true })
  }

  async deleteService(id: string): Promise<void> {
    await Service.findByIdAndDelete(id)
  }
}

export default new ServiceService()
