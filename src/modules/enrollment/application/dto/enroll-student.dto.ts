import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class EnrollStudentDto {
  @ApiProperty({ example: "uuid-do-aluno" })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ example: "uuid-da-turma" })
  @IsUUID()
  @IsNotEmpty()
  classOfferingId: string;
}
