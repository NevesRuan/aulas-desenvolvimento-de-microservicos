import { CreateSubjectDto } from "@academic/subjects/application/dto/create-subject.dto";
import { SubjectDto } from "@academic/subjects/application/dto/subject.dto";
import { UpdateSubjectDto } from "@academic/subjects/application/dto/update-subject.dto";
import { Subject } from "@academic/subjects/domain/models/subject.entity";
import {
  SUBJECT_REPOSITORY,
  type SubjectRepository,
} from "@academic/subjects/domain/repositories/subject-repository.interface";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { PaginatedResult, PaginationParams } from "@shared/infra/hateoas";

@Injectable()
export class SubjectService {
  constructor(
    @Inject(SUBJECT_REPOSITORY)
    private readonly subjectRepository: SubjectRepository,
  ) {}

  async create(dto: CreateSubjectDto): Promise<void> {
    const existing = await this.subjectRepository.findByCode(dto.code);

    if (existing) {
      throw new ConflictException("Code already registered");
    }

    const subject = Subject.restore(dto);
    await this.subjectRepository.create(subject!);
  }

  async edit(id: string, dto: UpdateSubjectDto): Promise<void> {
    const subject = await this.subjectRepository.findById(id);

    if (!subject) {
      throw new NotFoundException("Subject not found");
    }

    if (dto.code && dto.code !== subject.code) {
      const existing = await this.subjectRepository.findByCode(dto.code);

      if (existing) {
        throw new ConflictException("Code already registered");
      }
    }

    if (dto.name) subject.withName(dto.name);
    if (dto.code) subject.withCode(dto.code);
    if (dto.workload) subject.withWorkload(dto.workload);
    if (dto.description) subject.withDescription(dto.description);

    await this.subjectRepository.update(subject);
  }

  async remove(id: string): Promise<void> {
    await this.subjectRepository.delete(id);
  }

  async list(): Promise<SubjectDto[]> {
    const response = await this.subjectRepository.findAll();
    return response.map((row) => SubjectDto.from(row)!);
  }

  async listPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<SubjectDto>> {
    const { rows, total } =
      await this.subjectRepository.findAllPaginated(params);
    return {
      data: rows.map((row) => SubjectDto.from(row)!),
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  async findById(id: string): Promise<SubjectDto | null> {
    const response = await this.subjectRepository.findById(id);
    return SubjectDto.from(response);
  }

  async findByCode(code: string): Promise<SubjectDto | null> {
    const response = await this.subjectRepository.findByCode(code);
    return SubjectDto.from(response);
  }
}
