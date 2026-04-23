import { ClassOfferingService } from "@class-offering/application/services/class-offering.service";
import { ClassOfferingQueueService } from "@class-offering/application/services/class-offering-queue.service";
import { CLASS_OFFERING_REPOSITORY } from "@class-offering/domain/repositories/class-offering-repository.interface";
import { ClassOfferingConsumer } from "@class-offering/infra/controllers/class-offering.consumer";
import { ClassOfferingsController } from "@class-offering/infra/controllers/class-offerings.controller";
import { DrizzleClassOfferingRepository } from "@class-offering/infra/repositories/drizzle-class-offering.repository";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Module } from "@nestjs/common";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [
    SharedModule,
    ClientsModule.register([
      {
        name: 'CLASS_OFFERING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
          queue: 'class_offering_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [ClassOfferingsController, ClassOfferingConsumer],
  providers: [
    ClassOfferingService,
    ClassOfferingQueueService,
    DrizzleClassOfferingRepository,
    {
      provide: CLASS_OFFERING_REPOSITORY,
      useExisting: DrizzleClassOfferingRepository,
    },
  ],
})
export class ClassOfferingModule {}
