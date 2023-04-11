import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class PrivateMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  senderName: string;

  @Column()
  receiverName: string;

  @Column()
  message: string;

  @Column()
  messageStatus: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
