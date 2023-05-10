import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  senderName: string;

  @Column()
  receiverName: string;

  @Column()
  message: string;

  @Column()
  createdAt: string;
}
