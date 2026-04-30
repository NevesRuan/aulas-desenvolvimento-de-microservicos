import { ClassOfferingService } from "@class-offering/application/services/class-offering.service";
import { ClassOfferingQueueService } from "@class-offering/application/services/class-offering-queue.service";
import { CLASS_OFFERING_REPOSITORY } from "@class-offering/domain/repositories/class-offering-repository.interface";
import { ClassOfferingConsumer } from "@class-offering/infra/controllers/class-offering.consumer";
import { ClassOfferingsController } from "@class-offering/infra/controllers/class-offerings.controller";
import { RabbitMQService } from "@class-offering/infra/rabbitmq/rabbitmq.service";
import { DrizzleClassOfferingRepository } from "@class-offering/infra/repositories/drizzle-class-offering.repository";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [SharedModule, ConfigModule],
  controllers: [ClassOfferingsController],
  providers: [
    RabbitMQService,
    ClassOfferingQueueService,
    ClassOfferingConsumer,
    ClassOfferingService,
    DrizzleClassOfferingRepository,
    {
      provide: CLASS_OFFERING_REPOSITORY,
      useExisting: DrizzleClassOfferingRepository,
    },
  ],
})
export class ClassOfferingModule {}
