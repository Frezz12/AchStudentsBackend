import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AchievementsModule } from './achievements/achievements.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StudentAchievementsModule } from './student-achievements/student-achievements.module';
import { User } from './users/entities/user.entity';
import { Achievement } from './achievements/entities/achievements.entity';
import { StudentAchievement } from './student-achievements/student-achievement/entities/student-achievement.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [User, Achievement, StudentAchievement],
      synchronize: true, // В продакшене должно быть false
      logging: true,
    }),
    AchievementsModule, 
    UsersModule, 
    AuthModule, 
    StudentAchievementsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
