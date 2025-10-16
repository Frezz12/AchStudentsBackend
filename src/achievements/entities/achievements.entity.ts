import { StudentAchievement } from "src/student-achievements/student-achievement/entities/student-achievement.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export enum AchievementCategory {
  ACADEMIC = 'academic',
  SPORTS = 'sports',
  CREATIVE = 'creative',
  SOCIAL = 'social',
  LEADERSHIP = 'leadership'
}

@Entity('achievements')
export class Achievement {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', unique: true })
    uuid: string;

    @Column({ type: 'varchar', length: 255 })
    title: string

    @Column({ type: 'text' })
    description: string

    @Column({ type: 'int', default: 0 })
    starPoints: number;

    @Column({
      type: 'varchar',
      enum: AchievementCategory,
      default: AchievementCategory.ACADEMIC
    })
    category: AchievementCategory;

    @Column({ type: 'varchar', length: 255, nullable: true })
    iconUrl: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @ManyToOne(() => User, user => user.achievements, { nullable: true })
    createdBy: User;

    @OneToMany(() => StudentAchievement, studentAchievement => studentAchievement.achievement)
    studentAchievements: StudentAchievement[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    generateUuid() {
        this.uuid = uuidv4();
    }
}