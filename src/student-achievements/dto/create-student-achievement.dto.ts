import { IsString, IsOptional, IsNumber, IsEnum, IsUrl } from 'class-validator';
import { AchievementStatus } from '../student-achievement/entities/student-achievement.entity';

export class CreateStudentAchievementDto {
  @IsNumber()
  achievementId: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsUrl()
  @IsOptional()
  evidenceUrl?: string;
}

export class UpdateStudentAchievementDto {
  @IsEnum(AchievementStatus)
  @IsOptional()
  status?: AchievementStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsUrl()
  @IsOptional()
  evidenceUrl?: string;
}
