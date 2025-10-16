import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement, AchievementCategory } from './entities/achievements.entity';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
  ) {}

  async create(createAchievementDto: CreateAchievementDto, user: User): Promise<Achievement> {
    const achievement = this.achievementRepository.create({
      ...createAchievementDto,
      createdBy: user,
    });

    return this.achievementRepository.save(achievement);
  }

  async findAll(): Promise<Achievement[]> {
    return this.achievementRepository.find({
      relations: ['createdBy'],
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Achievement> {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
      relations: ['createdBy', 'studentAchievements', 'studentAchievements.student'],
    });

    if (!achievement) {
      throw new NotFoundException('Достижение не найдено');
    }

    return achievement;
  }

  async findByUuid(uuid: string): Promise<Achievement> {
    const achievement = await this.achievementRepository.findOne({
      where: { uuid },
      relations: ['createdBy', 'studentAchievements', 'studentAchievements.student'],
    });

    if (!achievement) {
      throw new NotFoundException('Достижение не найдено');
    }

    return achievement;
  }

  async update(id: number, updateData: Partial<CreateAchievementDto>, user: User): Promise<Achievement> {
    const achievement = await this.findOne(id);

    // Проверяем права доступа (только создатель или админ может редактировать)
    if (achievement.createdBy?.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('У вас нет прав для редактирования этого достижения');
    }

    Object.assign(achievement, updateData);
    return this.achievementRepository.save(achievement);
  }

  async remove(id: number, user: User): Promise<void> {
    const achievement = await this.findOne(id);

    // Проверяем права доступа (только создатель или админ может удалять)
    if (achievement.createdBy?.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('У вас нет прав для удаления этого достижения');
    }

    await this.achievementRepository.remove(achievement);
  }

  async findByCategory(category: AchievementCategory): Promise<Achievement[]> {
    return this.achievementRepository.find({
      where: { category, isActive: true },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async searchAchievements(searchTerm: string): Promise<Achievement[]> {
    return this.achievementRepository
      .createQueryBuilder('achievement')
      .leftJoinAndSelect('achievement.createdBy', 'createdBy')
      .where('achievement.isActive = :isActive', { isActive: true })
      .andWhere(
        '(achievement.title LIKE :searchTerm OR achievement.description LIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` }
      )
      .orderBy('achievement.createdAt', 'DESC')
      .getMany();
  }
}
