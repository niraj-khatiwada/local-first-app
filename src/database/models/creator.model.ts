import { UserEntity } from '@/api/user/entities/user.entity';
import { Column, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from './base.model';

export abstract class CreatorModel extends BaseModel {
  @Index({ where: '"deletedAt" IS NULL' })
  @Column()
  createdByUserId: string;

  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdByUserId' })
  createdBy: UserEntity;

  @Index({ where: '"deletedAt" IS NULL' })
  @Column()
  updatedByUserId: string;

  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updatedByUserId' })
  updatedBy: UserEntity;

  @Index({ where: '"deletedAt" IS NULL' })
  @Column({ nullable: true })
  deletedByUserId: string;

  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'deletedByUserId' })
  deletedBy: UserEntity;
}
