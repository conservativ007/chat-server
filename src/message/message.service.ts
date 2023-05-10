import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/websocket/messages/entities/message.entity';
import { Repository } from 'typeorm';
import { SetLikeForMessageDto } from './dto/set-like.dto';
import { PrivateMessageEntity } from 'src/websocket/messages/entities/privateMessage.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private chatRepository: Repository<MessageEntity>,
    @InjectRepository(PrivateMessageEntity)
    private privateMessageRepository: Repository<PrivateMessageEntity>,
  ) {}

  async setLikeForMessage(dto: SetLikeForMessageDto) {
    const { messageId, userName, action } = dto;

    console.log(messageId, userName, action);

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
      (name) => name === userName,
    );

    if (isUserAlreadyLikedThisMessage === -1) {
      message.likeCount = message.likeCount += 1;
      message.whoLiked.push(userName);
    } else {
      message.likeCount = message.likeCount -= 1;
      message.whoLiked.splice(isUserAlreadyLikedThisMessage, 1);
    }

    action === 'private'
      ? this.privateMessageRepository.save(message)
      : this.chatRepository.save(message);

    return message;
  }
}
