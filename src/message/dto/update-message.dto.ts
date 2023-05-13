import { IsNumber, IsString, isArray } from 'class-validator';

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
  message: string;

  @IsNumber()
  likeCount: number;

  @IsString({ each: true })
  whoLiked: string[];
}
