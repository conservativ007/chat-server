import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { CreatePrivateMessageDto } from './dto/create-private-message-dto';
import { IPrivateMessage } from 'src/common/types/interfaces';
import { MessageEntity } from './entities/message.entity';
import { RemoveSenderNameMessageForWho } from '../user-settings/dto/removeSenderNameMessageForWho.dto';
import { LikeForMessageForRecieverDto } from './dto/like-for-reciever.dto';
import { LastMessageForUsersDto } from './dto/last.message.for.users.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private usersService: UsersService,
  ) {}

  @SubscribeMessage('createMessageForAllChat')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
  ): Promise<void> {
    const newMessageForGeneralChat = await this.messagesService.createMessage(
      createMessageDto,
    );
    this.server.emit('messageForAllChat', newMessageForGeneralChat);
  }

  @SubscribeMessage('createPrivateMessage')
  async handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createPrivateMessageDto: CreatePrivateMessageDto,
  ): Promise<void> {
    const newPrivateMessage = await this.messagesService.createPrivateMessage(
      createPrivateMessageDto,
    );

    const receiverUser = await this.usersService.findOneByUserLogin(
      createPrivateMessageDto.receiverName,
    );

    client.emit('privateMessageForSender', newPrivateMessage);
    client
      .to(receiverUser.socketID)
      .emit('privateMessageForResiever', newPrivateMessage);

    if (receiverUser.targetForMessage === createPrivateMessageDto.senderName) {
      console.log(
        'receiverName.targetForMessage === createPrivateMessageDto.senderName',
      );
      return;
    }

    // set status unreadMessage to true and emit getAllUsers
    await this.usersService.addUserNameToMessageForWho(
      createPrivateMessageDto.senderName,
      createPrivateMessageDto.receiverName,
    );
    await this.getAllUsers();
  }

  @SubscribeMessage('removeNameForMessageTo')
  async handleRemoveNameForMessageTo(
    @MessageBody() { receiverName, senderName }: RemoveSenderNameMessageForWho,
  ) {
    await this.usersService.removeUserNameToMessageForWho(
      senderName,
      receiverName,
    );
    await this.getAllUsers();
  }

  // get all messages
  @SubscribeMessage('getAllMessages')
  async getAllMessages(@MessageBody() data: unknown): Promise<MessageEntity[]> {
    // console.log('from getAllMessages: ', data);
    return await this.messagesService.findAllMessages();
  }

  // get all private messages for sender and resiever
  @SubscribeMessage('getAllPrivateMessages')
  async handleGetAllPrivateMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() createPrivateMessageDto: IPrivateMessage,
  ): Promise<void> {
    const { receiverName, senderName } = createPrivateMessageDto;
    const allPrivateMessages = await this.messagesService.findPrivateMessagesBy(
      senderName,
      receiverName,
    );
    client.emit('privateMessagesForClients', allPrivateMessages);
  }

  @SubscribeMessage('getAllUsers')
  async getAllUsers(@MessageBody() myselfLogin?: string): Promise<void> {
    const users = await this.usersService.getAll();
    this.server.emit('getAllUsers', users);
  }

  @SubscribeMessage('likeForReciever')
  async likeForReciever(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: LikeForMessageForRecieverDto,
  ): Promise<void> {
    const reciever = await this.usersService.findOneById(dto.recieverId);
    console.log('reciever');
    console.log(reciever);

    // client.to(reciever.socketID).emit('sendUpdatedMessageForReciever', dto);
    client.to(reciever.socketID).emit('sentLikeForReciever', dto);
  }

  @SubscribeMessage('lastMessageForUsers')
  async lastMessageForUsers(
    @MessageBody() dto: LastMessageForUsersDto,
  ): Promise<void> {
    this.server.emit('setLastMessageForUsers', dto);
  }
}
