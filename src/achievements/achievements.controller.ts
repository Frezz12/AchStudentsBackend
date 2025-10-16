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
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { AchievementCategory } from './entities/achievements.entity';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAchievementDto: CreateAchievementDto, @Request() req) {
    const user: User = req.user;
    return this.achievementsService.create(createAchievementDto, user);
  }

  @Get()
  findAll(@Query('category') category?: AchievementCategory, @Query('search') search?: string) {
    if (category) {
      return this.achievementsService.findByCategory(category);
    }
    if (search) {
      return this.achievementsService.searchAchievements(search);
    }
    return this.achievementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.achievementsService.findOne(id);
  }

  @Get('uuid/:uuid')
  findByUuid(@Param('uuid') uuid: string) {
    return this.achievementsService.findByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateAchievementDto: Partial<CreateAchievementDto>,
    @Request() req
  ) {
    const user: User = req.user;
    return this.achievementsService.update(id, updateAchievementDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const user: User = req.user;
    return this.achievementsService.remove(id, user);
  }
}
