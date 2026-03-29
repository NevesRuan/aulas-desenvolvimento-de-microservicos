import { StudentDto } from "@academic/students/application/dto/student.dto";
import { CreateStudentService } from "@academic/students/application/services/create-student.service";
import { EditStudentService } from "@academic/students/application/services/edit-student.service";
import { ListStudentsService } from "@academic/students/application/services/list-students.service";
import { RemoveStudentService } from "@academic/students/application/services/remove-student.service";
import { ReturnStudentService } from "@academic/students/application/services/return-student.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";

@Controller("students")
export class StudentsController {
  constructor(
    private readonly createStudentService: CreateStudentService,
    private readonly editStudentService: EditStudentService,
    private readonly listStudentService: ListStudentsService,
    private readonly returnStudentService: ReturnStudentService,
    private readonly removeStudentService: RemoveStudentService,
  ) {}

  @Get()
  async findAll() {
    return this.listStudentService.execute();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.returnStudentService.executeById(id);
  }

  @Post()
  async create(@Body() body: StudentDto) {
    return this.createStudentService.execute(body);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: StudentDto) {
    return this.editStudentService.execute(id, body);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.removeStudentService.execute(id);
  }
}
