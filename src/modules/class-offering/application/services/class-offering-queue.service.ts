import { Injectable, OnModuleInit } from "@nestjs/common";
import { RabbitMQService } from "@class-offering/infra/rabbitmq/rabbitmq.service";

const CREATED_EXCHANGE  = "class-offering.created.exchange";
const UPDATED_EXCHANGE  = "class-offering.updated.exchange";
const CANCELED_EXCHANGE = "class-offering.canceled.exchange";

const CREATED_ROUTING_KEY  = "class-offering.created";
const UPDATED_ROUTING_KEY  = "class-offering.updated";
const CANCELED_ROUTING_KEY = "class-offering.canceled";

@Injectable()
export class ClassOfferingQueueService implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit(): Promise<void> {
    const channel = this.rabbitMQService.getChannel();
    await channel.assertExchange(CREATED_EXCHANGE,  "direct", { durable: true });
    await channel.assertExchange(UPDATED_EXCHANGE,  "direct", { durable: true });
    await channel.assertExchange(CANCELED_EXCHANGE, "direct", { durable: true });
  }

  publishCreated(id: string, data: unknown): void {
    const channel = this.rabbitMQService.getChannel();
    channel.publish(
      CREATED_EXCHANGE,
      CREATED_ROUTING_KEY,
      Buffer.from(JSON.stringify({ id, data, timestamp: new Date() })),
      { persistent: true },
    );
  }

  publishUpdated(id: string, data: unknown): void {
    const channel = this.rabbitMQService.getChannel();
    channel.publish(
      UPDATED_EXCHANGE,
      UPDATED_ROUTING_KEY,
      Buffer.from(JSON.stringify({ id, data, timestamp: new Date() })),
      { persistent: true },
    );
  }

  publishCanceled(id: string, data: unknown): void {
    const channel = this.rabbitMQService.getChannel();
    channel.publish(
      CANCELED_EXCHANGE,
      CANCELED_ROUTING_KEY,
      Buffer.from(JSON.stringify({ id, data, timestamp: new Date() })),
      { persistent: true },
    );
  }
}
