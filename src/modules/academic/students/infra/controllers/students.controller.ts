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

@Controller("students")
export class StudentsController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async findAll() {
    return this.studentService.list();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.studentService.findById(id);
  }

  @Post()
  async create(@Body() body: StudentDto) {
    return this.studentService.create(body);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: StudentDto) {
    return this.studentService.edit(id, body);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.studentService.remove(id);
  }
}
