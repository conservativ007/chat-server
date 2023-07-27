import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { SetLikeForMessageDto } from './dto/set-like.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CreateMessageDto } from '../websocket/messages/dto/create-message.dto';
import { MessageEntity } from '../websocket/messages/entities/message.entity';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @HttpCode(200)
  @Get('/find-one-message-general-chat/:id')
  async findOne(@Param('id') id: string): Promise<MessageEntity> {
    const message = await this.messageService.findOneMessageInGeneralChat(id);
    return message;
  }

  @HttpCode(201)
  @Post('/create-message-for-general-chat')
  async createMessageForGeneralChat(@Body() dto: CreateMessageDto) {
    const newMessage = await this.messageService.createMessageForGeneralChat(
      dto,
    );
    return newMessage;
  }

  @HttpCode(201)
  @Post('/create-private-message')
  async createPrivateMessage(@Body() dto: CreateMessageDto) {
    // console.log('/create-private-message');
    // console.log(dto);
    const newMessage = await this.messageService.createPrivateMessage(dto);
    return newMessage;
  }

  @HttpCode(201)
  @Post('/message-like')
  async setLikeForMessage(@Body() dto: SetLikeForMessageDto) {
    const message = await this.messageService.setLikeForMessage(dto);
    return message;
  }

  @HttpCode(201)
  @Post('/private-message-edit')
  async messageEditForPrivateChat(@Body() dto: UpdateMessageDto) {
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

  @HttpCode(204)
  @Delete('/private-message-delete/:id')
  async messageDeleteForPrivateChat(@Param('id', ParseUUIDPipe) id: string) {
    await this.messageService.deletePrivateMessage(id);
  }

  @HttpCode(204)
  @Delete('/general-chat-message-delete/:id')
  async messageDeleteForGeneralChat(@Param('id', ParseUUIDPipe) id: string) {
    await this.messageService.deleteGeneralChatMessage(id);
  }
}
