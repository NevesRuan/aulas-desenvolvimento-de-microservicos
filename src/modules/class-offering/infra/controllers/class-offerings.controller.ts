import { ClassOfferingService } from "@class-offering/application/services/class-offering.service";
import { ClassOfferingStatus } from "@class-offering/domain/models/class-offering.entity";
import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { Permission } from "@shared/domain/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";

@Controller("class-offerings")
export class ClassOfferingsController {
  constructor(private readonly classOfferingService: ClassOfferingService) {}

  @Get()
  @RequirePermissions(Permission.CLASS_OFFERINGS_READ)
  async findAll() {
    return this.classOfferingService.list();
  }

  @Get(":id")
  @RequirePermissions(Permission.CLASS_OFFERINGS_READ)
  async findById(@Param("id") id: string) {
    return this.classOfferingService.findById(id);
  }

  @Post()
  @RequirePermissions(Permission.CLASS_OFFERINGS_WRITE)
  async create(
    @Body()
    body: {
      subjectId: string;
      teacherId: string;
      startDate: Date;
      endDate: Date;
    },
  ) {
    return this.classOfferingService.create(body);
  }

  @Patch(":id/status")
  @RequirePermissions(Permission.CLASS_OFFERINGS_WRITE)
  async changeStatus(
    @Param("id") id: string,
    @Body() body: { status: ClassOfferingStatus },
  ) {
    return this.classOfferingService.changeStatus(id, body.status);
  }
}
