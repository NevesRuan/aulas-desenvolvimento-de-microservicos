import { StudentDto } from "@academic/students/application/dto/student.dto";
import { StudentService } from "@academic/students/application/services/student.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { Permission } from "@shared/domain/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";

@Controller("students")
export class StudentsController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @RequirePermissions(Permission.STUDENTS_READ)
  async findAll() {
    return this.studentService.list();
  }

  @Get(":id")
  @RequirePermissions(Permission.STUDENTS_READ)
  async findById(@Param("id") id: string) {
    return this.studentService.findById(id);
  }

  @Post()
  @RequirePermissions(Permission.STUDENTS_WRITE)
  async create(@Body() body: StudentDto) {
    return this.studentService.create(body);
  }

  @Put(":id")
  @RequirePermissions(Permission.STUDENTS_WRITE)
  async update(@Param("id") id: string, @Body() body: StudentDto) {
    return this.studentService.edit(id, body);
  }

  @Delete(":id")
  @RequirePermissions(Permission.STUDENTS_DELETE)
  async remove(@Param("id") id: string) {
    return this.studentService.remove(id);
  }
}
