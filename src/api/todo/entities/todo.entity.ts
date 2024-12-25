import { CreatorModel } from '@/database/models/creator.model';
import { Column, Entity } from 'typeorm';

@Entity('todo')
export class TodoEntity extends CreatorModel {
  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  completedAt: Date;
}
