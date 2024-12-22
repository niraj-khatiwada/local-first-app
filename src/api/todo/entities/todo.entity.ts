import { BaseModel } from '@/database/models/base.model';
import { Column, Entity } from 'typeorm';

@Entity('todo')
export class TodoEntity extends BaseModel {
  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  completedAt: Date;
}
