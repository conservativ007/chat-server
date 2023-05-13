import { type } from 'os';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class PrivateMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senderName: string;

  @Column()
  receiverName: string;

  @Column()
  message: string;

  @Column({ default: 0 })
  likeCount: number;

  @Column('simple-array', { default: '' })
  whoLiked: string[];

  @Column()
  createdAt: string;

  @Column({ type: 'bigint' })
  createdDateForSort: number;

  constructor(partial: Partial<PrivateMessageEntity>) {
    Object.assign(this, partial);
  }
}
