import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import type { ConsumeMessage } from "amqplib";
import { eq } from "drizzle-orm";
import { RabbitMQService } from "@class-offering/infra/rabbitmq/rabbitmq.service";
import { subjectsSchema } from "@class-offering/infra/schemas/subject.schema";
import { teachersSchema } from "@class-offering/infra/schemas/teacher.schema";
import { DrizzleService } from "@shared/infra/database/drizzle.service";

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

type QueueRoutingKey = typeof QUEUES[number]["routingKey"];

@Injectable()
export class ClassOfferingConsumer implements OnApplicationBootstrap {
  private readonly logger = new Logger(ClassOfferingConsumer.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly drizzleService: DrizzleService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const channel = this.rabbitMQService.getChannel();

    for (const { queue, exchange, routingKey } of QUEUES) {
      await channel.assertExchange(exchange, "direct", { durable: true });
      await channel.assertQueue(queue, { durable: true });
      await channel.bindQueue(queue, exchange, routingKey);
      await channel.consume(queue, async (msg: ConsumeMessage | null) => {
        if (!msg) return;
        try {
          const payload = JSON.parse(msg.content.toString());
          await this.handle(routingKey, payload);
          channel.ack(msg);
        } catch (err) {
          this.logger.error(`[${queue}] failed to process message: ${err}`);
          channel.nack(msg, false, false);
        }
      });
    }
  }

  private async handle(routingKey: QueueRoutingKey, payload: { id: string; data: { name: string } }): Promise<void> {
    const db = this.drizzleService.db;
    const { id, data } = payload;

    switch (routingKey) {
      case "subject.created":
        await db.insert(subjectsSchema).values({ id, name: data.name });
        this.logger.log(`Subject created locally: ${id}`);
        break;

      case "subject.updated":
        await db.update(subjectsSchema).set({ name: data.name }).where(eq(subjectsSchema.id, id));
        this.logger.log(`Subject updated locally: ${id}`);
        break;

      case "subject.deleted":
        await db.delete(subjectsSchema).where(eq(subjectsSchema.id, id));
        this.logger.log(`Subject deleted locally: ${id}`);
        break;

      case "teacher.created":
        await db.insert(teachersSchema).values({ id, name: data.name });
        this.logger.log(`Teacher created locally: ${id}`);
        break;

      case "teacher.updated":
        await db.update(teachersSchema).set({ name: data.name }).where(eq(teachersSchema.id, id));
        this.logger.log(`Teacher updated locally: ${id}`);
        break;

      case "teacher.deleted":
        await db.delete(teachersSchema).where(eq(teachersSchema.id, id));
        this.logger.log(`Teacher deleted locally: ${id}`);
        break;
    }
  }
}
