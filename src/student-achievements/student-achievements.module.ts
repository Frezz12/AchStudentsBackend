import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentAchievementsService } from './student-achievements.service';
import { StudentAchievementsController } from './student-achievements.controller';
import { StudentAchievement } from './student-achievement/entities/student-achievement.entity';
import { User } from '../users/entities/user.entity';
import { Achievement } from '../achievements/entities/achievements.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentAchievement, User, Achievement])],
  controllers: [StudentAchievementsController],
  providers: [StudentAchievementsService],
  exports: [StudentAchievementsService],
})
export class StudentAchievementsModule {}
