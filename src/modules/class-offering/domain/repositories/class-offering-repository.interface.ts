import type {
  ClassOffering,
  ClassOfferingStatus,
} from "@class-offering/domain/models/class-offering.entity";
import type { PaginatedResult } from "@shared/infra/hateoas";

export const CLASS_OFFERING_REPOSITORY = Symbol("CLASS_OFFERING_REPOSITORY");

export interface ClassOfferingRepository {
  create(classOffering: ClassOffering): Promise<void>;
  findAll(): Promise<ClassOffering[]>;
  findAllPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedResult<ClassOffering>>;
  findById(id: string): Promise<ClassOffering | null>;
  updateStatus(id: string, status: ClassOfferingStatus): Promise<void>;
}
