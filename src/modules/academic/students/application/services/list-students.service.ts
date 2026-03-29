import { StudentDto } from "@academic/students/application/dto/student.dto";
import {
  STUDENT_REPOSITORY,
  type StudentRepository,
} from "@academic/students/domain/repositories/student-repository.interface";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ListStudentsService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: StudentRepository,
  ) {}

  async execute(): Promise<StudentDto[]> {
    const response = await this.studentRepository.findAll();
    return response.map((row) => StudentDto.fromStudent(row)!);
  }
}
