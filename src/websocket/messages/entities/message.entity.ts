import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MessageEntity {
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
}
