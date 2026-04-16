import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import type { ClassOffering } from "@class-offering/domain/models/class-offering.entity";

// DTO de entrada — com validação
export class CreateClassOfferingDto {
  @ApiProperty({
    description: "ID único da disciplina (UUID)",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  subjectId: string;

  @ApiProperty({
    description: "ID único do professor (UUID)",
    example: "550e8400-e29b-41d4-a716-446655440001",
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  teacherId: string;

  @ApiProperty({
    description: "Data de início da turma (ISO 8601)",
    example: "2026-04-15T10:00:00Z",
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: "Data de término da turma (ISO 8601)",
    example: "2026-12-20T10:00:00Z",
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}

export class UpdateClassOfferingDto {
  @ApiProperty({
    description: "ID único da disciplina (UUID)",
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsUUID()
  subjectId?: string;

  @ApiProperty({
    description: "ID único do professor (UUID)",
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @ApiProperty({
    description: "Data de início da turma (ISO 8601)",
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    description: "Data de término da turma (ISO 8601)",
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;
}

// DTO de resposta — sem validação
export class ClassOfferingDto {
  @ApiProperty()
  id: string | undefined;

  @ApiProperty()
  subjectId: string;

  @ApiProperty()
  teacherId: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  status: string;

  private constructor(
    id: string | undefined,
    subjectId: string,
    teacherId: string,
    startDate: Date,
    endDate: Date,
    status: string,
  ) {
    this.id = id;
    this.subjectId = subjectId;
    this.teacherId = teacherId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
  }

  public static from(
    classOffering: ClassOffering | null,
  ): ClassOfferingDto | null {
    if (!classOffering) return null;
    return new ClassOfferingDto(
      classOffering.id,
      classOffering.subjectId,
      classOffering.teacherId,
      classOffering.startDate,
      classOffering.endDate,
      classOffering.status,
    );
  }
}
