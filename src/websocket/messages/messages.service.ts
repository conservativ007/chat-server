import { Injectable } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findPrivateMessagesBy(senderId: string, receiverId: string) {
    const messages = await this.privateMessageRepository.find();
    const correctedMessages = messages.filter((message) => {
      const values = Object.values(message);

      const sender = values.includes(senderId);
      const reciever = values.includes(receiverId);

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
