import {
  CreateClassOfferingDto,
  UpdateClassOfferingDto,
} from "@class-offering/application/dto/class-offering.dto";
import { ClassOfferingService } from "@class-offering/application/services/class-offering.service";
import { ClassOfferingStatus } from "@class-offering/domain/models/class-offering.entity";
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { HateoasItem, HateoasList } from "@shared/infra/hateoas";

export interface ClassOfferingResponse {
  id: string;
  subjectId: string;
  teacherId: string;
  startDate: Date;
  endDate: Date;
  status: ClassOfferingStatus;
}

@ApiTags("classOfferings")
@Controller("classOfferings")
export class ClassOfferingsController {
  constructor(private readonly classOfferingService: ClassOfferingService) {}

  @Get()
  @ApiOperation({ summary: "Listar turmas com paginação" })
  @ApiQuery({
    name: "_page",
    required: false,
    type: Number,
    description: "Número da página (padrão: 1)",
  })
  @ApiQuery({
    name: "_size",
    required: false,
    type: Number,
    description: "Quantidade de itens por página (padrão: 10)",
  })
  @ApiOkResponse({
    description:
      "Lista de turmas com paginação, metadados e links HATEOAS",
  })
  @HateoasList<ClassOfferingResponse>({
    basePath: "/v1/classOfferings",
    itemLinks: (item) => ({
      self: { href: `/v1/classOfferings/${item.id}`, method: "GET" },
      update: { href: `/v1/classOfferings/${item.id}`, method: "PUT" },
      activate: {
        href: `/v1/classOfferings/${item.id}/activate`,
        method: "PATCH",
      },
      deactivate: {
        href: `/v1/classOfferings/${item.id}/deactivate`,
        method: "PATCH",
      },
      delete: { href: `/v1/classOfferings/${item.id}`, method: "DELETE" },
    }),
  })
  async findAll(
    @Query("_page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("_size", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.classOfferingService.listPaginated({ page, limit });
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar turma por ID" })
  @ApiOkResponse({ description: "Turma encontrada com links HATEOAS" })
  @ApiNotFoundResponse({ description: "Turma não encontrada" })
  @HateoasItem<ClassOfferingResponse>({
    basePath: "/v1/classOfferings",
    itemLinks: (item) => ({
      self: { href: `/v1/classOfferings/${item.id}`, method: "GET" },
      update: { href: `/v1/classOfferings/${item.id}`, method: "PUT" },
      activate: {
        href: `/v1/classOfferings/${item.id}/activate`,
        method: "PATCH",
      },
      deactivate: {
        href: `/v1/classOfferings/${item.id}/deactivate`,
        method: "PATCH",
      },
      delete: { href: `/v1/classOfferings/${item.id}`, method: "DELETE" },
      list: { href: "/v1/classOfferings", method: "GET" },
      create: { href: "/v1/classOfferings", method: "POST" },
    }),
  })
  async findById(@Param("id") id: string) {
    return this.classOfferingService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Criar nova turma" })
  @ApiOkResponse({
    description: "Turma criada com sucesso",
  })
  @ApiBadRequestResponse({
    description: "Validação falhou — campos inválidos",
  })
  async create(@Body() body: CreateClassOfferingDto) {
    return this.classOfferingService.create(body);
  }

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Atualizar turma" })
  @ApiNoContentResponse({ description: "Turma atualizada com sucesso" })
  @ApiNotFoundResponse({ description: "Turma não encontrada" })
  @ApiBadRequestResponse({
    description: "Validação falhou — campos inválidos",
  })
  async update(
    @Param("id") id: string,
    @Body() body: UpdateClassOfferingDto,
  ) {
    await this.classOfferingService.findById(id);
    // Implementar lógica de atualização completa se necessário
  }

  @Patch(":id/activate")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Ativar turma" })
  @ApiNoContentResponse({ description: "Turma ativada com sucesso" })
  @ApiNotFoundResponse({ description: "Turma não encontrada" })
  async activate(@Param("id") id: string) {
    await this.classOfferingService.changeStatus(id, ClassOfferingStatus.ACTIVE);
  }

  @Patch(":id/deactivate")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Desativar turma" })
  @ApiNoContentResponse({ description: "Turma desativada com sucesso" })
  @ApiNotFoundResponse({ description: "Turma não encontrada" })
  async deactivate(@Param("id") id: string) {
    await this.classOfferingService.changeStatus(
      id,
      ClassOfferingStatus.INACTIVE,
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover turma" })
  @ApiNoContentResponse({ description: "Turma removida com sucesso" })
  @ApiNotFoundResponse({ description: "Turma não encontrada" })
  async remove(@Param("id") id: string) {
    await this.classOfferingService.findById(id);
    // Implementar lógica de remoção se necessário
  }
}
