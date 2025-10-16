import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentAchievement, AchievementStatus } from './student-achievement/entities/student-achievement.entity';
import { CreateStudentAchievementDto, UpdateStudentAchievementDto } from './dto/create-student-achievement.dto';
import { User } from '../users/entities/user.entity';
import { Achievement } from '../achievements/entities/achievements.entity';

@Injectable()
export class StudentAchievementsService {
  constructor(
    @InjectRepository(StudentAchievement)
    private studentAchievementRepository: Repository<StudentAchievement>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
  ) {}

  async create(createDto: CreateStudentAchievementDto, user: User): Promise<StudentAchievement> {
    const { achievementId, notes, evidenceUrl } = createDto;

    // Проверяем, существует ли достижение
    const achievement = await this.achievementRepository.findOne({ where: { id: achievementId } });
    if (!achievement) {
      throw new NotFoundException('Достижение не найдено');
    }

    // Проверяем, не получил ли уже студент это достижение
    const existingStudentAchievement = await this.studentAchievementRepository.findOne({
      where: {
        student: { id: user.id },
        achievement: { id: achievementId },
      },
    });

    if (existingStudentAchievement) {
      throw new ConflictException('Студент уже получил это достижение');
    }

    const studentAchievement = this.studentAchievementRepository.create({
      student: user,
      achievement,
      notes,
      evidenceUrl,
      status: AchievementStatus.PENDING,
    });

    return this.studentAchievementRepository.save(studentAchievement);
  }

  async createForStudent(studentId: number, createDto: CreateStudentAchievementDto, actor: User): Promise<StudentAchievement> {
    const { achievementId, notes, evidenceUrl } = createDto;

    // Только админ или куратор могут выдавать достижения другим пользователям
    if (!(actor.role === 'admin' || actor.role === 'curator')) {
      throw new ForbiddenException('Недостаточно прав для выдачи достижения');
    }

    const student = await this.userRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Студент не найден');
    }

    const achievement = await this.achievementRepository.findOne({ where: { id: achievementId } });
    if (!achievement) {
      throw new NotFoundException('Достижение не найдено');
    }

    const existing = await this.studentAchievementRepository.findOne({
      where: { student: { id: student.id }, achievement: { id: achievementId } },
    });
    if (existing) {
      throw new ConflictException('Студент уже получил это достижение');
    }

    const studentAchievement = this.studentAchievementRepository.create({
      student,
      achievement,
      notes,
      evidenceUrl,
      status: AchievementStatus.PENDING,
    });

    return this.studentAchievementRepository.save(studentAchievement);
  }

  async findAll(): Promise<StudentAchievement[]> {
    return this.studentAchievementRepository.find({
      relations: ['student', 'achievement', 'approvedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStudent(studentId: number): Promise<StudentAchievement[]> {
    return this.studentAchievementRepository.find({
      where: { student: { id: studentId } },
      relations: ['student', 'achievement', 'approvedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByAchievement(achievementId: number): Promise<StudentAchievement[]> {
    return this.studentAchievementRepository.find({
      where: { achievement: { id: achievementId } },
      relations: ['student', 'achievement', 'approvedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: AchievementStatus): Promise<StudentAchievement[]> {
    return this.studentAchievementRepository.find({
      where: { status },
      relations: ['student', 'achievement', 'approvedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<StudentAchievement> {
    const studentAchievement = await this.studentAchievementRepository.findOne({
      where: { id },
      relations: ['student', 'achievement', 'approvedBy'],
    });

    if (!studentAchievement) {
      throw new NotFoundException('Связь студент-достижение не найдена');
    }

    return studentAchievement;
  }

  async findByUuid(uuid: string): Promise<StudentAchievement> {
    const studentAchievement = await this.studentAchievementRepository.findOne({
      where: { uuid },
      relations: ['student', 'achievement', 'approvedBy'],
    });

    if (!studentAchievement) {
      throw new NotFoundException('Связь студент-достижение не найдена');
    }

    return studentAchievement;
  }

  async update(id: number, updateDto: UpdateStudentAchievementDto, user: User): Promise<StudentAchievement> {
    const studentAchievement = await this.findOne(id);

    // Проверяем права доступа
    const canUpdate = 
      studentAchievement.student.id === user.id || // Студент может обновлять свои достижения
      user.role === 'admin' || // Админ может обновлять все
      user.role === 'curator'; // Куратор может обновлять все

    if (!canUpdate) {
      throw new ForbiddenException('У вас нет прав для обновления этого достижения');
    }

    // Если статус меняется на approved/rejected, записываем кто одобрил
    if (updateDto.status && updateDto.status !== AchievementStatus.PENDING) {
      (updateDto as any).approvedBy = user;
    }

    Object.assign(studentAchievement, updateDto);
    return this.studentAchievementRepository.save(studentAchievement);
  }

  async remove(id: number, user: User): Promise<void> {
    const studentAchievement = await this.findOne(id);

    // Проверяем права доступа
    const canDelete = 
      studentAchievement.student.id === user.id || // Студент может удалять свои достижения
      user.role === 'admin'; // Только админ может удалять чужие достижения

    if (!canDelete) {
      throw new ForbiddenException('У вас нет прав для удаления этого достижения');
    }

    await this.studentAchievementRepository.remove(studentAchievement);
  }

  async getStudentStats(studentId: number): Promise<any> {
    const achievements = await this.studentAchievementRepository.find({
      where: { student: { id: studentId } },
      relations: ['achievement'],
    });

    const totalPoints = achievements
      .filter(sa => sa.status === AchievementStatus.APPROVED)
      .reduce((sum, sa) => sum + sa.achievement.starPoints, 0);

    const stats = {
      totalAchievements: achievements.length,
      approvedAchievements: achievements.filter(sa => sa.status === AchievementStatus.APPROVED).length,
      pendingAchievements: achievements.filter(sa => sa.status === AchievementStatus.PENDING).length,
      rejectedAchievements: achievements.filter(sa => sa.status === AchievementStatus.REJECTED).length,
      totalPoints,
    };

    return stats;
  }

  async getAchievementStats(achievementId: number): Promise<any> {
    const achievements = await this.studentAchievementRepository.find({
      where: { achievement: { id: achievementId } },
      relations: ['student'],
    });

    const stats = {
      totalStudents: achievements.length,
      approvedStudents: achievements.filter(sa => sa.status === AchievementStatus.APPROVED).length,
      pendingStudents: achievements.filter(sa => sa.status === AchievementStatus.PENDING).length,
      rejectedStudents: achievements.filter(sa => sa.status === AchievementStatus.REJECTED).length,
    };

    return stats;
  }
}
