import { IsString } from 'class-validator';

export class LogoutDto {
  @IsString()
  socketID: string;
}
