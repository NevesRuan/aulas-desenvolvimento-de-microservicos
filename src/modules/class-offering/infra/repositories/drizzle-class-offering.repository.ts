import {
  ClassOffering,
  ClassOfferingStatus,
} from "@class-offering/domain/models/class-offering.entity";
import type { ClassOfferingRepository } from "@class-offering/domain/repositories/class-offering-repository.interface";
import { classOfferingsSchema } from "@class-offering/infra/schemas/class-offering.schema";
import { Injectable } from "@nestjs/common";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import type { PaginatedResult } from "@shared/infra/hateoas";
import { count, eq } from "drizzle-orm";

@Injectable()
export class DrizzleClassOfferingRepository implements ClassOfferingRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(classOffering: ClassOffering): Promise<string> {
    const result = await this.drizzleService.db.insert(classOfferingsSchema).values({
      subjectId: classOffering.subjectId,
      teacherId: classOffering.teacherId,
      startDate: classOffering.startDate,
      endDate: classOffering.endDate,
      status: classOffering.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning({ id: classOfferingsSchema.id });

    return result[0].id;
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

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedResult<ClassOffering>> {
    const offset = (page - 1) * limit;

    const [rows, countResult] = await Promise.all([
      this.drizzleService.db
        .select()
        .from(classOfferingsSchema)
        .limit(limit)
        .offset(offset),
      this.drizzleService.db
        .select({ count: count() })
        .from(classOfferingsSchema),
    ]);

    const total = countResult[0]?.count || 0;

    return {
      data: rows.map(
        (row) =>
          ClassOffering.restore({
            ...row,
            status: row.status as ClassOfferingStatus,
          })!,
      ),
      total: typeof total === "number" ? total : 0,
      page,
      limit,
    };
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

  async updateStatus(id: string, status: ClassOfferingStatus): Promise<void> {
    await this.drizzleService.db
      .update(classOfferingsSchema)
      .set({ status, updatedAt: new Date() })
      .where(eq(classOfferingsSchema.id, id));
  }
}
