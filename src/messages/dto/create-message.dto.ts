// import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  senderName: string;

  @IsString()
  receiverName: string;

  @IsString()
  message: string;

  // @IsString()
  // login: string;

  // @IsString()
  // text: string;
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
