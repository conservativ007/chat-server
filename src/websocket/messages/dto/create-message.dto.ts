import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  senderName: string;

  @IsString()
  receiverName: string;

  @IsString()
  message: string;
}
