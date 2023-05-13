import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { SetLikeForMessageDto } from './dto/set-like.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @HttpCode(201)
  @Post('/message-like')
  async setLikeForMessage(@Body() dto: SetLikeForMessageDto) {
    const message = await this.messageService.setLikeForMessage(dto);
    // console.log(message);
    return message;
  }

  @HttpCode(201)
  @Post('/private-message-edit')
  async messageEditForPrivateChat(@Body() dto: UpdateMessageDto) {
    // console.log(dto);
    const updatedMessage = await this.messageService.updatePrivateMessage(dto);

    return updatedMessage;
  }

  @HttpCode(201)
  @Post('/general-chat-message-edit')
  async messageEditForGeneralChat(@Body() dto: UpdateMessageDto) {
    const updatedMessage = await this.messageService.updateGeneralChatMessage(
      dto,
    );
    return updatedMessage;
  }
}
