import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  firstname: string;

  @IsString()
  @MinLength(2)
  lastname: string;

  @IsString()
  @MinLength(2)
  surname: string;

  @IsString()
  @MinLength(2)
  college: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
