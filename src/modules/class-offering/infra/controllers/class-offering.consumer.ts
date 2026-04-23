import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { RabbitMQService } from "@class-offering/infra/rabbitmq/rabbitmq.service";

const QUEUES = [
  {
    queue:      "class-offering.academic-subjects.created.queue",
    exchange:   "academic.subjects.created.exchange",
    routingKey: "subject.created",
  },
  {
    queue:      "class-offering.academic-subjects.updated.queue",
    exchange:   "academic.subjects.updated.exchange",
    routingKey: "subject.updated",
  },
  {
    queue:      "class-offering.academic-subjects.deleted.queue",
    exchange:   "academic.subjects.deleted.exchange",
    routingKey: "subject.deleted",
  },
  {
    queue:      "class-offering.academic-teachers.created.queue",
    exchange:   "academic.teachers.created.exchange",
    routingKey: "teacher.created",
  },
  {
    queue:      "class-offering.academic-teachers.updated.queue",
    exchange:   "academic.teachers.updated.exchange",
    routingKey: "teacher.updated",
  },
  {
    queue:      "class-offering.academic-teachers.deleted.queue",
    exchange:   "academic.teachers.deleted.exchange",
    routingKey: "teacher.deleted",
  },
] as const;

@Injectable()
export class ClassOfferingConsumer implements OnModuleInit {
  private readonly logger = new Logger(ClassOfferingConsumer.name);

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit(): Promise<void> {
    const channel = this.rabbitMQService.getChannel();

    for (const { queue, exchange, routingKey } of QUEUES) {
      await channel.assertExchange(exchange, "direct", { durable: true });
      await channel.assertQueue(queue, { durable: true });
      await channel.bindQueue(queue, exchange, routingKey);
      await channel.consume(queue, (msg) => {
        if (!msg) return;
        const content = JSON.parse(msg.content.toString());
        this.logger.log(`[${queue}] received: ${JSON.stringify(content)}`);
        channel.ack(msg);
      });
    }
  }
}
