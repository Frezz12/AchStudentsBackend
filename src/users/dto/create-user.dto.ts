import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  firstname: string;

  @IsString()
  @MinLength(2)
  lastname: string;

  @IsString()
  @MinLength(2)
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  college: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
