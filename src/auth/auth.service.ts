import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstname, lastname, surname, college, role } = registerDto;

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Создаем нового пользователя
    const user = this.userRepository.create({
      email,
      password,
      firstname,
      lastname,
      surname,
      college,
      role: role || UserRole.STUDENT,
    });

    const savedUser = await this.userRepository.save(user);

    // Загружаем достижения и связанные сущности
    const savedUserWithRelations = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['achievements', 'achievements.achievement', 'achievements.approvedBy'],
    });
    if (!savedUserWithRelations) {
      throw new InternalServerErrorException('Не удалось загрузить данные пользователя после регистрации');
    }

    // Генерируем JWT токен
    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
      uuid: savedUser.uuid,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: savedUserWithRelations.id,
        uuid: savedUserWithRelations.uuid,
        email: savedUserWithRelations.email,
        firstname: savedUserWithRelations.firstname,
        lastname: savedUserWithRelations.lastname,
        surname: savedUserWithRelations.surname,
        college: savedUserWithRelations.college,
        role: savedUserWithRelations.role,
        createdAt: savedUserWithRelations.createdAt,
        achievements: savedUserWithRelations.achievements,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Находим пользователя по email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    // Генерируем JWT токен
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      uuid: user.uuid,
    };

    const token = this.jwtService.sign(payload);

    // Загружаем пользователя с достижениями для ответа
    const userWithRelations = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['achievements', 'achievements.achievement', 'achievements.approvedBy'],
    });
    if (!userWithRelations) {
      throw new InternalServerErrorException('Не удалось загрузить данные пользователя');
    }

    return {
      user: {
        id: userWithRelations.id,
        uuid: userWithRelations.uuid,
        email: userWithRelations.email,
        firstname: userWithRelations.firstname,
        lastname: userWithRelations.lastname,
        surname: userWithRelations.surname,
        college: userWithRelations.college,
        role: userWithRelations.role,
        createdAt: userWithRelations.createdAt,
        achievements: userWithRelations.achievements,
      },
      token,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
