import { IsString } from 'class-validator';

export class RemoveSenderNameMessageForWho {
  @IsString()
  senderName: string;

  @IsString()
  receiverName: string;
}
