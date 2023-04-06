import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  login: string;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}
