import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/websocket/messages/entities/message.entity';
import { Repository } from 'typeorm';
import { SetLikeForMessageDto } from './dto/set-like.dto';
import { PrivateMessageEntity } from 'src/websocket/messages/entities/privateMessage.entity';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CreateMessageDto } from 'src/websocket/messages/dto/create-message.dto';
import { CreatePrivateMessageDto } from 'src/websocket/messages/dto/create-private-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private chatRepository: Repository<MessageEntity>,
    @InjectRepository(PrivateMessageEntity)
    private privateMessageRepository: Repository<PrivateMessageEntity>,
  ) {}

  getCurrentTime() {
    let now = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const time = now.toLocaleString('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    return time;
  }

  async createMessageForGeneralChat(dto: CreateMessageDto) {
    const newMessage = {
      ...dto,
      createdAt: this.getCurrentTime(),
      createdDateForSort: Date.now(),
    };

    const message = this.chatRepository.create(newMessage);
    await this.chatRepository.save(message);
    return message;
  }

  async createPrivateMessage(
    createPrivateMessageDto: CreatePrivateMessageDto,
  ): Promise<PrivateMessageEntity> {
    const privateMessage = {
      ...createPrivateMessageDto,
      createdAt: this.getCurrentTime(),
      createdDateForSort: Date.now(),
    };

    const newPrivateMessage = await this.privateMessageRepository.create(
      privateMessage,
    );
    await this.privateMessageRepository.save(newPrivateMessage);
    return newPrivateMessage;
  }

  async setLikeForMessage(dto: SetLikeForMessageDto) {
    const { messageId, senderName, action } = dto;

    // console.log(messageId, senderName, action);

    let message: MessageEntity | PrivateMessageEntity;

    if (action === 'private') {
      message = await this.privateMessageRepository.findOneBy({
        id: messageId,
      });
    }
    if (action === 'public') {
      message = await this.chatRepository.findOneBy({ id: messageId });
    }

    if (message === null) {
      throw new NotFoundException('message not found');
    }

    let isUserAlreadyLikedThisMessage = message.whoLiked.findIndex(
      (name) => name === senderName,
    );

    if (isUserAlreadyLikedThisMessage === -1) {
      message.likeCount = message.likeCount += 1;
      message.whoLiked.push(senderName);
    } else {
      message.likeCount = message.likeCount -= 1;
      message.whoLiked.splice(isUserAlreadyLikedThisMessage, 1);
    }

    action === 'private'
      ? this.privateMessageRepository.save(message)
      : this.chatRepository.save(message);

    return message;
  }

  async updatePrivateMessage(dto: UpdateMessageDto) {
    const updatedMesage: MessageEntity =
      await this.privateMessageRepository.save(dto);
    return updatedMesage;
  }

  async updateGeneralChatMessage(dto: UpdateMessageDto) {
    const updatedMesage: MessageEntity = await this.chatRepository.save(dto);
    return updatedMesage;
  }

  async deletePrivateMessage(id: string) {
    const message = await this.privateMessageRepository.findOneBy({ id });
    if (message === null) {
      throw new NotFoundException('message not found');
    }
    await this.privateMessageRepository.delete(id);
  }

  async deleteGeneralChatMessage(id: string) {
    const message = await this.chatRepository.findOneBy({ id });
    if (message === null) {
      throw new NotFoundException('message not found');
    }
    await this.chatRepository.delete(id);
  }
}
