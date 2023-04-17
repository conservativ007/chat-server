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
  viewed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
