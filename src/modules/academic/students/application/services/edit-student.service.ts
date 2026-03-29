import type { StudentDto } from "@academic/students/application/dto/student.dto";
import {
  STUDENT_REPOSITORY,
  type StudentRepository,
} from "@academic/students/domain/repositories/student-repository.interface";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

@Injectable()
export class EditStudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: StudentRepository,
  ) {}

  async execute(id: string, dto: StudentDto): Promise<void> {
    const student = await this.studentRepository.findById(id);

    if (!student) {
      throw new NotFoundException("Student not found");
    }

    if (dto.email && dto.email !== student.email) {
      const existing = await this.studentRepository.findByEmail(dto.email);

      if (existing) {
        throw new ConflictException("Email already registered");
      }
    }

    student.withName(dto.name).withEmail(dto.email).withDocument(dto.document);
    await this.studentRepository.update(student!);
  }
}
