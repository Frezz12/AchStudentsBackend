import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request, 
  Query,
  ParseIntPipe 
} from '@nestjs/common';
import { StudentAchievementsService } from './student-achievements.service';
import { CreateStudentAchievementDto, UpdateStudentAchievementDto } from './dto/create-student-achievement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { AchievementStatus } from './student-achievement/entities/student-achievement.entity';

@Controller('student-achievements')
export class StudentAchievementsController {
  constructor(private readonly studentAchievementsService: StudentAchievementsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDto: CreateStudentAchievementDto, @Request() req) {
    const user: User = req.user;
    return this.studentAchievementsService.create(createDto, user);
  }

  @Get()
  findAll(
    @Query('studentId') studentId?: string,
    @Query('achievementId') achievementId?: string,
    @Query('status') status?: AchievementStatus,
  ) {
    if (studentId) {
      return this.studentAchievementsService.findByStudent(parseInt(studentId));
    }
    if (achievementId) {
      return this.studentAchievementsService.findByAchievement(parseInt(achievementId));
    }
    if (status) {
      return this.studentAchievementsService.findByStatus(status);
    }
    return this.studentAchievementsService.findAll();
  }

  @Get('stats/student/:studentId')
  getStudentStats(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.studentAchievementsService.getStudentStats(studentId);
  }

  @Get('stats/achievement/:achievementId')
  getAchievementStats(@Param('achievementId', ParseIntPipe) achievementId: number) {
    return this.studentAchievementsService.getAchievementStats(achievementId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentAchievementsService.findOne(id);
  }

  @Get('uuid/:uuid')
  findByUuid(@Param('uuid') uuid: string) {
    return this.studentAchievementsService.findByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateDto: UpdateStudentAchievementDto,
    @Request() req
  ) {
    const user: User = req.user;
    return this.studentAchievementsService.update(id, updateDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const user: User = req.user;
    return this.studentAchievementsService.remove(id, user);
  }
}
