import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrivateMessageDto } from './dto/create-private-message-dto';
import { PrivateMessageEntity } from './entities/privateMessage.entity';

@Injectable()
export class MessagesService {
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

  async createMessage(
    createMessageDto: CreateMessageDto,
  ): Promise<MessageEntity> {
    const newMessage = {
      ...createMessageDto,
      createdAt: this.getCurrentTime(),
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
    };

    const newPrivateMessage = await this.privateMessageRepository.create(
      privateMessage,
    );
    await this.privateMessageRepository.save(newPrivateMessage);
    return newPrivateMessage;
  }

  async findAllPrivateMessages() {
    const messages = await this.privateMessageRepository.find();
    return messages;
  }

  async _conditiosTestFunc(
    senderName: string,
    receiverName: string,
    message: any,
  ) {
    if (
      message.senderName === senderName &&
      message.receiverName === receiverName
    ) {
      return true;
    }
    return false;
  }

  async findPrivateMessagesBy(senderName: string, receiverName: string) {
    const messages = await this.privateMessageRepository.find();
    const correctedMessages = messages.filter((message) => {
      const values = Object.values(message);

      const sender = values.includes(senderName);
      const reciever = values.includes(receiverName);

      if (sender === true && reciever === true) return message;
    });
    // console.log(correctedMessages);
    return correctedMessages;
  }

  async findAllMessages() {
    const messages = await this.chatRepository.find();
    return messages;
  }
}
