import type { Permission } from "@shared/domain/enums/permission.enum";
import type { User } from "@users/domain/models/user.entity";

export class CreateUserDto {
  email: string;
  password: string;
  teacherId?: string;
  permissions: Permission[];
}

export class UpdateUserDto {
  email?: string;
  password?: string;
  teacherId?: string;
  permissions?: Permission[];
}

export class UserResponseDto {
  private constructor(
    public id: string,
    public email: string,
    public teacherId: string | undefined,
    public permissions: string[],
    public createdAt: Date | undefined,
    public updatedAt: Date | undefined,
  ) {}

  static from(user: User | null): UserResponseDto | null {
    if (!user) return null;
    return new UserResponseDto(
      user.id!,
      user.email,
      user.teacherId,
      user.permissions,
      user.createdAt,
      user.updatedAt,
    );
  }
}

export interface UserPayload {
  id: string;
  email: string;
  permissions: string[];
}
