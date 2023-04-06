// import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}

// import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

// export class CreateMessageDto {
//   @PrimaryGeneratedColumn('uuid')
//   id: number;

//   @Column()
//   login: string;

//   @Column()
//   text: string;

//   @CreateDateColumn()
//   createdAt: Date;
// }
