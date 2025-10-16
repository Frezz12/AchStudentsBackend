import { StudentAchievement } from 'src/student-achievements/student-achievement/entities/student-achievement.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  STUDENT = 'student',
  CURATOR = 'curator',
  ADMIN = 'admin'
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', unique: true })
    uuid: string;

    @Column({type: 'varchar', length: 255})
    firstname: string;

    @Column({type: 'varchar', length: 255})
    lastname: string;

    @Column({type: 'varchar', length: 255})
    surname: string;

    @Column({type: 'varchar', length: 255, unique: true})
    email: string;

    @Column({type: 'varchar', length: 255})
    password: string;

    @Column({
      type: 'varchar',
      default: UserRole.STUDENT,
      enum: UserRole
    })
    role: UserRole

    @Column({type: 'varchar', length: 255, nullable: true})
    college: string | null;

    @OneToMany(() => StudentAchievement, studentAchievement => studentAchievement.student)
    achievements: StudentAchievement[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    generateUuid() {
        this.uuid = uuidv4();
    }

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}