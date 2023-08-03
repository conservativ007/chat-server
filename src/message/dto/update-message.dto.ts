import { IsNumber, IsString } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  id: string;

  @IsString()
  createdAt: string;

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

  @IsNumber()
  likeCount: number;

  @IsString({ each: true })
  whoLiked: string[];
}
