import { Achievement } from "src/achievements/entities/achievements.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, JoinColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export enum AchievementStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

@Entity('student_achievements')
export class StudentAchievement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true })
    uuid: string;

    @ManyToOne(() => User, user => user.achievements, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'studentId' })
    student: User;

    @ManyToOne(() => Achievement, achievement => achievement.studentAchievements, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'achievementId' })
    achievement: Achievement;

    @Column({
      type: 'varchar',
      enum: AchievementStatus,
      default: AchievementStatus.PENDING
    })
    status: AchievementStatus;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    evidenceUrl: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'approvedBy' })
    approvedBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    generateUuid() {
        this.uuid = uuidv4();
    }
}