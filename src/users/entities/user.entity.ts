import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  hashedRt: string;

  @Column()
  version: number;

  @Column()
  online: boolean;

  @Column()
  @Column({ nullable: true })
  targetForMessage: string;

  @Column('simple-array')
  messageForWho: string[];

  @Column({ nullable: true })
  socketID: string;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column({ type: 'bigint' })
  updatedAt: number;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
