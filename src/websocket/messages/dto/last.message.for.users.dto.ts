import { IsString } from 'class-validator';

export class LastMessageForUsersDto {
  @IsString()
  id: string;

  @IsString()
  createdAt: string;

  @IsString()
  likeCount: number;

  @IsString()
  message: string;

  @IsString()
  receiverName: string;

  @IsString()
  senderName: number;

  @IsString()
  whoLiked: string[];
}
