import { AttendanceService } from "@attendance/application/services/attendance.service";
import { AttendanceStatus } from "@attendance/domain/models/attendance.entity";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Permission } from "@shared/domain/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";

@Controller("attendances")
export class AttendancesController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get("student/:studentId/class-offering/:classOfferingId")
  @RequirePermissions(Permission.ATTENDANCES_READ)
  async findByStudent(
    @Param("studentId") studentId: string,
    @Param("classOfferingId") classOfferingId: string,
  ) {
    return this.attendanceService.findByStudentAndClassOffering(
      studentId,
      classOfferingId,
    );
  }

  @Get("class-offering/:classOfferingId")
  @RequirePermissions(Permission.ATTENDANCES_READ)
  async findByClassOffering(@Param("classOfferingId") classOfferingId: string) {
    return this.attendanceService.findByClassOffering(classOfferingId);
  }

  @Post()
  @RequirePermissions(Permission.ATTENDANCES_WRITE)
  async register(
    @Body() body: {
      studentId: string;
      lessonId: string;
      classOfferingId: string;
      status: AttendanceStatus;
    },
  ) {
    return this.attendanceService.register(body);
  }
}
