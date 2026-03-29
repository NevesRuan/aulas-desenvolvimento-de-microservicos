import { TeacherDto } from "@academic/teachers/application/dto/teacher.dto";
import { TeacherService } from "@academic/teachers/application/services/teacher.service";
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

@Controller("teachers")
export class TeachersController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @RequirePermissions(Permission.TEACHERS_READ)
  async findAll() {
    return this.teacherService.list();
  }

  @Get(":id")
  @RequirePermissions(Permission.TEACHERS_READ)
  async findById(@Param("id") id: string) {
    return this.teacherService.findById(id);
  }

  @Post()
  @RequirePermissions(Permission.TEACHERS_WRITE)
  async create(@Body() body: TeacherDto) {
    return this.teacherService.create(body);
  }

  @Put(":id")
  @RequirePermissions(Permission.TEACHERS_WRITE)
  async update(@Param("id") id: string, @Body() body: TeacherDto) {
    return this.teacherService.edit(id, body);
  }

  @Delete(":id")
  @RequirePermissions(Permission.TEACHERS_DELETE)
  async remove(@Param("id") id: string) {
    return this.teacherService.remove(id);
  }
}
