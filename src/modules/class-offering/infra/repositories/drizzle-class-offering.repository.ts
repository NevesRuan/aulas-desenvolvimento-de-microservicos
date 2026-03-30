import {
  ClassOffering,
  ClassOfferingStatus,
} from "@class-offering/domain/models/class-offering.entity";
import type { ClassOfferingRepository } from "@class-offering/domain/repositories/class-offering-repository.interface";
import { classOfferingsSchema } from "@class-offering/infra/database/schemas/class-offering.schema";
import { Injectable } from "@nestjs/common";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import type { PaginationParams } from "@shared/infra/hateoas";
import { eq, sql } from "drizzle-orm";

@Injectable()
export class DrizzleClassOfferingRepository implements ClassOfferingRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(classOffering: ClassOffering): Promise<void> {
    await this.drizzleService.db.insert(classOfferingsSchema).values({
      subjectId: classOffering.subjectId,
      teacherId: classOffering.teacherId,
      startDate: classOffering.startDate,
      endDate: classOffering.endDate,
      status: classOffering.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll(): Promise<ClassOffering[]> {
    const rows = await this.drizzleService.db
      .select()
      .from(classOfferingsSchema);
    return rows.map(
      (row) =>
        ClassOffering.restore({
          ...row,
          status: row.status as ClassOfferingStatus,
        })!,
    );
  }

  async findById(id: string): Promise<ClassOffering | null> {
    const result = await this.drizzleService.db
      .select()
      .from(classOfferingsSchema)
      .where(eq(classOfferingsSchema.id, id))
      .limit(1);

    if (!result[0]) return null;

    return ClassOffering.restore({
      ...result[0],
      status: result[0].status as ClassOfferingStatus,
    });
  }

  async findAllPaginated(params: PaginationParams): Promise<{ rows: ClassOffering[]; total: number }> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    const [rows, [countResult]] = await Promise.all([
      this.drizzleService.db.select().from(classOfferingsSchema).limit(limit).offset(offset),
      this.drizzleService.db
        .select({ count: sql<number>`count(*)::int` })
        .from(classOfferingsSchema),
    ]);

    return {
      rows: rows.map((row) =>
        ClassOffering.restore({ ...row, status: row.status as ClassOfferingStatus })!,
      ),
      total: countResult.count,
    };
  }

  async updateStatus(id: string, status: ClassOfferingStatus): Promise<void> {
    await this.drizzleService.db
      .update(classOfferingsSchema)
      .set({ status, updatedAt: new Date() })
      .where(eq(classOfferingsSchema.id, id));
  }
}
