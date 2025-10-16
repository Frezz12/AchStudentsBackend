import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'uuid', 'firstname', 'lastname', 'surname', 'email', 'role', 'college', 'createdAt', 'updatedAt'],
      relations: ['achievements', 'achievements.achievement', 'achievements.approvedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'uuid', 'firstname', 'lastname', 'surname', 'email', 'role', 'college', 'createdAt', 'updatedAt'],
      relations: ['achievements', 'achievements.achievement', 'achievements.approvedBy'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findByUuid(uuid: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { uuid },
      select: ['id', 'uuid', 'firstname', 'lastname', 'surname', 'email', 'role', 'college', 'createdAt', 'updatedAt'],
      relations: ['achievements', 'achievements.achievement', 'achievements.approvedBy'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({
      where: { role },
      select: ['id', 'uuid', 'firstname', 'lastname', 'surname', 'email', 'role', 'college', 'createdAt', 'updatedAt'],
      relations: ['achievements', 'achievements.achievement', 'achievements.approvedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateData: Partial<CreateUserDto>, currentUser: User): Promise<User> {
    const user = await this.findOne(id);

    // Проверяем права доступа
    const canUpdate = 
      user.id === currentUser.id || // Пользователь может обновлять свой профиль
      currentUser.role === 'admin'; // Только админ может обновлять чужие профили

    if (!canUpdate) {
      throw new ForbiddenException('У вас нет прав для обновления этого пользователя');
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async remove(id: number, currentUser: User): Promise<void> {
    const user = await this.findOne(id);

    // Проверяем права доступа
    const canDelete = 
      user.id === currentUser.id || // Пользователь может удалить свой профиль
      currentUser.role === 'admin'; // Только админ может удалять чужие профили

    if (!canDelete) {
      throw new ForbiddenException('У вас нет прав для удаления этого пользователя');
    }

    await this.userRepository.remove(user);
  }

  async getUsersStats(): Promise<any> {
    const users = await this.userRepository.find();
    
    const stats = {
      totalUsers: users.length,
      students: users.filter(u => u.role === UserRole.STUDENT).length,
      curators: users.filter(u => u.role === UserRole.CURATOR).length,
      admins: users.filter(u => u.role === UserRole.ADMIN).length,
    };

    return stats;
  }
}
