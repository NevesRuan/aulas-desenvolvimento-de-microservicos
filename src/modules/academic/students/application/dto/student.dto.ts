import type { Student } from "@academic/students/domain/models/student.entity";

export class StudentDto {
  private constructor(
    public name: string,
    public email: string,
    public document: string,
    public registration: string,
  ) {}

  public static fromStudent(student: Student | null): StudentDto | null {
    if (!student) return null;
    return new StudentDto(
      student.name,
      student.email,
      student.document,
      student.registration,
    );
  }
}
