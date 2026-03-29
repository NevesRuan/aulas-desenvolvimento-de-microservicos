import type { StudentDto } from "@academic/students/application/dto/student.dto";
import { Student } from "@academic/students/domain/models/student.entity";
import {
  STUDENT_REPOSITORY,
  type StudentRepository,
} from "@academic/students/domain/repositories/student-repository.interface";
import { ConflictException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateStudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: StudentRepository,
  ) {}

  async execute(dto: StudentDto): Promise<void> {
    const existing = await this.studentRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const student = Student.restore(dto);
    await this.studentRepository.create(student!);
  }
}
