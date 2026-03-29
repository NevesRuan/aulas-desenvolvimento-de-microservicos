import { EnrollmentService } from "@enrollment/application/services/enrollment.service";
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Permission } from "@shared/domain/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";

@Controller("enrollments")
export class EnrollmentsController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get("class-offering/:classOfferingId")
  @RequirePermissions(Permission.ENROLLMENTS_READ)
  async findByClassOffering(@Param("classOfferingId") classOfferingId: string) {
    return this.enrollmentService.listByClassOffering(classOfferingId);
  }

  @Post()
  @RequirePermissions(Permission.ENROLLMENTS_WRITE)
  async enroll(@Body() body: { studentId: string; classOfferingId: string }) {
    return this.enrollmentService.enroll(body);
  }

  @Delete(":id")
  @RequirePermissions(Permission.ENROLLMENTS_DELETE)
  async cancel(@Param("id") id: string) {
    return this.enrollmentService.cancel(id);
  }
}
