import { EnrollmentDto } from "@enrollment/application/dto/enrollment.dto";
import {
  Enrollment,
  EnrollmentStatus,
} from "@enrollment/domain/models/enrollment.entity";
import {
  ENROLLMENT_REPOSITORY,
  type EnrollmentRepository,
} from "@enrollment/domain/repositories/enrollment-repository.interface";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { PaginatedResult } from "@shared/infra/hateoas";

@Injectable()
export class EnrollmentService {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: EnrollmentRepository,
  ) {}

  async enroll(dto: {
    studentId: string;
    classOfferingId: string;
  }): Promise<void> {
    const existing =
      await this.enrollmentRepository.findByStudentAndClassOffering(
        dto.studentId,
        dto.classOfferingId,
      );

    if (existing) {
      throw new ConflictException(
        "Student is already enrolled in this class offering",
      );
    }

    const enrollment = Enrollment.restore({
      studentId: dto.studentId,
      classOfferingId: dto.classOfferingId,
      status: EnrollmentStatus.ACTIVE,
      enrolledAt: new Date(),
    });

    await this.enrollmentRepository.create(enrollment!);
  }

  async cancel(id: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findById(id);

    if (!enrollment) {
      throw new NotFoundException("Enrollment not found");
    }

    await this.enrollmentRepository.cancel(id);
  }

  async listByClassOffering(
    classOfferingId: string,
  ): Promise<PaginatedResult<EnrollmentDto>> {
    const response =
      await this.enrollmentRepository.findByClassOfferingId(classOfferingId);
    const data = response.map((row) => EnrollmentDto.from(row)!);
    return { data, total: data.length, page: 1, limit: data.length || 1 };
  }
}
