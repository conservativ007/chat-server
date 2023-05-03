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

  async createMessage(createMessageDto: CreateMessageDto): Promise<void> {
    await this.chatRepository.save(createMessageDto);
  }

  async createPrivateMessage(
    createPrivateMessageDto: CreatePrivateMessageDto,
  ): Promise<PrivateMessageEntity> {
    const privateMessage = {
      senderName: createPrivateMessageDto.senderName,
      receiverName: createPrivateMessageDto.receiverName,
      message: createPrivateMessageDto.message,
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
