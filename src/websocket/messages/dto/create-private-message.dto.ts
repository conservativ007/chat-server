import { IsNumber, IsString } from 'class-validator';

export class CreatePrivateMessageDto {
  @IsString()
  senderName: string;

  @IsString()
  receiverName: string;

  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsString()
  message: string;

  @IsString()
  imageSrc: string;

  @IsNumber()
  fileId: number;

  @IsString()
  fileName: string;

  @IsNumber()
  fileSize: number;
}
