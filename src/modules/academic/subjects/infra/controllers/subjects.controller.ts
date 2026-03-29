import { SubjectDto } from "@academic/subjects/application/dto/subject.dto";
import { SubjectService } from "@academic/subjects/application/services/subject.service";
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

@Controller("subjects")
export class SubjectsController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  @RequirePermissions(Permission.SUBJECTS_READ)
  async findAll() {
    return this.subjectService.list();
  }

  @Get(":id")
  @RequirePermissions(Permission.SUBJECTS_READ)
  async findById(@Param("id") id: string) {
    return this.subjectService.findById(id);
  }

  @Post()
  @RequirePermissions(Permission.SUBJECTS_WRITE)
  async create(@Body() body: SubjectDto) {
    return this.subjectService.create(body);
  }

  @Put(":id")
  @RequirePermissions(Permission.SUBJECTS_WRITE)
  async update(@Param("id") id: string, @Body() body: SubjectDto) {
    return this.subjectService.edit(id, body);
  }

  @Delete(":id")
  @RequirePermissions(Permission.SUBJECTS_DELETE)
  async remove(@Param("id") id: string) {
    return this.subjectService.remove(id);
  }
}
