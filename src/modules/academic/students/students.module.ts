import { STUDENT_REPOSITORY } from "@academic/students/domain/repositories/student-repository.interface";
import { StudentsController } from "@academic/students/infra/controllers/students.controller";
import { DrizzleStudentRepository } from "@academic/students/infra/repositories/drizzle-student.repository";
import { DatabaseModule } from "@infra/database/database.module";
import { Module } from "@nestjs/common";
import { StudentService } from "./application/services/student.service";

@Module({
  imports: [DatabaseModule],
  controllers: [StudentsController],
  providers: [
    StudentService,
    DrizzleStudentRepository,
    {
      provide: STUDENT_REPOSITORY,
      useExisting: DrizzleStudentRepository,
    },
  ],
})
export class StudentsModule {}
