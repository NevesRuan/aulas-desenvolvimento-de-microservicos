import { CreateStudentService } from "@academic/students/application/services/create-student.service";
import { EditStudentService } from "@academic/students/application/services/edit-student.service";
import { ListStudentsService } from "@academic/students/application/services/list-students.service";
import { RemoveStudentService } from "@academic/students/application/services/remove-student.service";
import { ReturnStudentService } from "@academic/students/application/services/return-student.service";
import { STUDENT_REPOSITORY } from "@academic/students/domain/repositories/student-repository.interface";
import { StudentsController } from "@academic/students/infra/controllers/students.controller";
import { DrizzleStudentRepository } from "@academic/students/infra/repositories/drizzle-student.repository";
import { DatabaseModule } from "@infra/database/database.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [DatabaseModule],
  controllers: [StudentsController],
  providers: [
    CreateStudentService,
    EditStudentService,
    ListStudentsService,
    ReturnStudentService,
    RemoveStudentService,
    DrizzleStudentRepository,
    {
      provide: STUDENT_REPOSITORY,
      useExisting: DrizzleStudentRepository,
    },
  ],
})
export class StudentsModule {}
