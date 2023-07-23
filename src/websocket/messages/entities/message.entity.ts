import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senderName: string;

  @Column()
  receiverName: string;

  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @Column()
  imageSrc: string;

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

  constructor(partial: Partial<MessageEntity>) {
    Object.assign(this, partial);
  }
}
