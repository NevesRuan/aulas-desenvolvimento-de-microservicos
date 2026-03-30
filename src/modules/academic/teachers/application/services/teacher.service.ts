import { CreateTeacherDto } from "@academic/teachers/application/dto/create-teacher.dto";
import { TeacherDto } from "@academic/teachers/application/dto/teacher.dto";
import { UpdateTeacherDto } from "@academic/teachers/application/dto/update-teacher.dto";
import { Teacher } from "@academic/teachers/domain/models/teacher.entity";
import {
  TEACHER_REPOSITORY,
  type TeacherRepository,
} from "@academic/teachers/domain/repositories/teacher-repository.interface";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { PaginatedResult, PaginationParams } from "@shared/infra/hateoas";

@Injectable()
export class TeacherService {
  constructor(
    @Inject(TEACHER_REPOSITORY)
    private readonly teacherRepository: TeacherRepository,
  ) {}

  async create(dto: CreateTeacherDto): Promise<void> {
    const existing = await this.teacherRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const teacher = Teacher.restore(dto);
    await this.teacherRepository.create(teacher!);
  }

  async edit(id: string, dto: UpdateTeacherDto): Promise<void> {
    const teacher = await this.teacherRepository.findById(id);

    if (!teacher) {
      throw new NotFoundException("Teacher not found");
    }

    if (dto.email && dto.email !== teacher.email) {
      const existing = await this.teacherRepository.findByEmail(dto.email);

      if (existing) {
        throw new ConflictException("Email already registered");
      }
    }

    if (dto.name) teacher.withName(dto.name);
    if (dto.email) teacher.withEmail(dto.email);
    if (dto.document) teacher.withDocument(dto.document);
    if (dto.degree) teacher.withDegree(dto.degree);
    if (dto.specialization) teacher.withSpecialization(dto.specialization);
    if (dto.admissionDate) teacher.withAdmissionDate(dto.admissionDate);

    await this.teacherRepository.update(teacher);
  }

  async remove(id: string): Promise<void> {
    await this.teacherRepository.delete(id);
  }

  async list(): Promise<TeacherDto[]> {
    const response = await this.teacherRepository.findAll();
    return response.map((row) => TeacherDto.from(row)!);
  }

  async listPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<TeacherDto>> {
    const { rows, total } =
      await this.teacherRepository.findAllPaginated(params);
    return {
      data: rows.map((row) => TeacherDto.from(row)!),
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  async findById(id: string): Promise<TeacherDto | null> {
    const response = await this.teacherRepository.findById(id);
    return TeacherDto.from(response);
  }

  async findByEmail(email: string): Promise<TeacherDto | null> {
    const response = await this.teacherRepository.findByEmail(email);
    return TeacherDto.from(response);
  }
}
