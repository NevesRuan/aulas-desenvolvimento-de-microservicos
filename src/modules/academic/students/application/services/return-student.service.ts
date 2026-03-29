import { StudentDto } from "@academic/students/application/dto/student.dto";
import {
  STUDENT_REPOSITORY,
  type StudentRepository,
} from "@academic/students/domain/repositories/student-repository.interface";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ReturnStudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: StudentRepository,
  ) {}

  async executeById(id: string): Promise<StudentDto | null> {
    const response = await this.studentRepository.findById(id);
    return StudentDto.fromStudent(response);
  }

  async executeByEmail(email: string): Promise<StudentDto | null> {
    const response = await this.studentRepository.findByEmail(email);
    return StudentDto.fromStudent(response);
  }
}
