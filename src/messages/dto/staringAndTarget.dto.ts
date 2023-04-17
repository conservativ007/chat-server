import { IsString } from 'class-validator';

export class StaringAndTarget {
  @IsString()
  myself: string;

  @IsString()
  target: string;
}
