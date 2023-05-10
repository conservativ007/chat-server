import { IsString } from 'class-validator';

export class CreatePrivateMessageDto {
  @IsString()
  senderName: string;

  @IsString()
  receiverName: string;

  @IsString()
  message: string;
}
