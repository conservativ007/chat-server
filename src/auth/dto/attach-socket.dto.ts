import { IsString } from 'class-validator';

export class AttachSocketDto {
  @IsString()
  socketId: string;

  @IsString()
  userId: string;
}
