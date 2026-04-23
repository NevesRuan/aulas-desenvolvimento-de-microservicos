import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ClassOfferingQueueService {
  constructor(
    @Inject('CLASS_OFFERING_SERVICE') private client: ClientProxy,
  ) {}

  async publishClassOfferingCreated(classOfferingId: string, data: any) {
    return this.client.emit('class_offering.created', {
      classOfferingId,
      data,
      timestamp: new Date(),
    });
  }

  async publishClassOfferingUpdated(classOfferingId: string, data: any) {
    return this.client.emit('class_offering.updated', {
      classOfferingId,
      data,
      timestamp: new Date(),
    });
  }
}