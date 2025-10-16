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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User, UserRole } from './entities/user.entity';
import { Roles } from '../common/guards/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateStudentAchievementDto } from '../student-achievements/dto/create-student-achievement.dto';
import { StudentAchievementsService } from '../student-achievements/student-achievements.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly studentAchievementsService: StudentAchievementsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    const currentUser: User = req.user;
    // Только админы могут создавать пользователей через API
    if (currentUser.role !== UserRole.ADMIN) {
      throw new Error('Только администраторы могут создавать пользователей');
    }
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CURATOR)
  @Post(':id/achievements')
  grantAchievement(
    @Param('id', ParseIntPipe) id: number,
    @Body() createDto: CreateStudentAchievementDto,
    @Request() req,
  ) {
    const actor: User = req.user;
    return this.studentAchievementsService.createForStudent(id, createDto, actor);
  }

  @Get()
  findAll(@Query('role') role?: UserRole) {
    if (role) {
      return this.usersService.findByRole(role);
    }
    return this.usersService.findAll();
  }

  @Get('stats')
  getUsersStats() {
    return this.usersService.getUsersStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get('uuid/:uuid')
  findByUuid(@Param('uuid') uuid: string) {
    return this.usersService.findByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: Partial<CreateUserDto>,
    @Request() req
  ) {
    const currentUser: User = req.user;
    return this.usersService.update(id, updateUserDto, currentUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const currentUser: User = req.user;
    return this.usersService.remove(id, currentUser);
  }
}
