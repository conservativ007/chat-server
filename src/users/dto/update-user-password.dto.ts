import { IsString } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
  userId: string;

  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}
