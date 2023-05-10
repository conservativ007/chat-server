import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { SetLikeForMessageDto } from './dto/set-like.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @HttpCode(201)
  @Post('/message-like')
  async setLikeForMessage(@Body() dto: SetLikeForMessageDto) {
    const message = await this.messageService.setLikeForMessage(dto);
    console.log(message);
    return message;
  }
}
