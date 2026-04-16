import {
  CreateClassOfferingDto,
  UpdateClassOfferingDto,
} from "@class-offering/application/dto/class-offering.dto";
import { ClassOfferingDto } from "@class-offering/application/dto/class-offering.dto";
import {
  ClassOffering,
  ClassOfferingStatus,
} from "@class-offering/domain/models/class-offering.entity";
import {
  CLASS_OFFERING_REPOSITORY,
  type ClassOfferingRepository,
} from "@class-offering/domain/repositories/class-offering-repository.interface";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { PaginatedResult } from "@shared/infra/hateoas";

@Injectable()
export class ClassOfferingService {
  constructor(
    @Inject(CLASS_OFFERING_REPOSITORY)
    private readonly classOfferingRepository: ClassOfferingRepository,
  ) {}

  async create(dto: CreateClassOfferingDto): Promise<void> {
    const classOffering = ClassOffering.restore({
      subjectId: dto.subjectId,
      teacherId: dto.teacherId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      status: ClassOfferingStatus.ACTIVE,
    });

    await this.classOfferingRepository.create(classOffering!);
  }

  async list(): Promise<ClassOfferingDto[]> {
    const response = await this.classOfferingRepository.findAll();
    return response.map((row) => ClassOfferingDto.from(row)!);
  }

  async listPaginated(params: {
    page: number;
    limit: number;
  }): Promise<PaginatedResult<ClassOfferingDto>> {
    const result = await this.classOfferingRepository.findAllPaginated(
      params.page,
      params.limit,
    );

    return {
      data: result.data.map((row) => ClassOfferingDto.from(row)!),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  async findById(id: string): Promise<ClassOfferingDto | null> {
    const response = await this.classOfferingRepository.findById(id);
    return ClassOfferingDto.from(response);
  }

  async changeStatus(id: string, status: ClassOfferingStatus): Promise<void> {
    const classOffering = await this.classOfferingRepository.findById(id);

    if (!classOffering) {
      throw new NotFoundException("ClassOffering not found");
    }

    await this.classOfferingRepository.updateStatus(id, status);
  }
}
