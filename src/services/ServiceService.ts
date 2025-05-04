import { ICreateService, IService } from '../interfaces/IService'
import Service from '../models/Service'

class ServiceService {
  async createService(serviceData: ICreateService): Promise<IService> {
    const service = new Service(serviceData)
    return await service.save()
  }

  async listServices(): Promise<IService[]> {
    return await Service.find({ isDeleted: { $ne: true } })
  }

  async listOwnServices(providerId: string): Promise<IService[]> {
    return await Service.find({ providerId, isDeleted: { $ne: true } })
  }

  async getServiceById(id: string): Promise<IService | null> {
    return await Service.findById(id)
  }

  async listServicesByProvider(providerId: string): Promise<IService[]> {
    return await Service.find({
      providerId,
      isDeleted: { $ne: true },
    })
  }

  async updateService(
    id: string,
    serviceData: Partial<ICreateService>
  ): Promise<IService | null> {
    return await Service.findByIdAndUpdate(id, serviceData, { new: true })
  }

  async deleteService(id: string): Promise<void> {
    await Service.findByIdAndUpdate(id, {
      isDeleted: true,
    })
  }
}

export default new ServiceService()
