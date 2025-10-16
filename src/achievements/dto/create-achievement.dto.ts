import { IsString, IsEnum, IsInt, Min, IsOptional, IsUrl, IsBoolean } from 'class-validator';
import { AchievementCategory } from '../entities/achievements.entity';

export class CreateAchievementDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  starPoints: number;

  @IsEnum(AchievementCategory)
  @IsOptional()
  category?: AchievementCategory;

  @IsUrl()
  @IsOptional()
  iconUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}