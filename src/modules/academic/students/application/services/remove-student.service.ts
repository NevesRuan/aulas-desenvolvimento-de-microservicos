import {
  STUDENT_REPOSITORY,
  type StudentRepository,
} from "@academic/students/domain/repositories/student-repository.interface";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class RemoveStudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: StudentRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.studentRepository.delete(id);
  }
}
