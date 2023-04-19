import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePrivateMessageDto } from './dto/create-private-message-dto';
import { IPrivateMessage } from 'src/common/types/interfaces';
import { MessageEntity } from './entities/message.entity';
import { RemoveSenderNameMessageForWho } from './dto/removeSenderNameMessageForWho.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway
  implements OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private usersService: UsersService,
  ) {}
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('createMessageForAllChat')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
  ): Promise<void> {
    await this.messagesService.createMessage(createMessageDto);
    this.server.emit('messageForAllChat', createMessageDto);
  }

  @SubscribeMessage('createPrivateMessage')
  async handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createPrivateMessageDto: CreatePrivateMessageDto,
  ): Promise<void> {
    const newPrivateMessage = await this.messagesService.createPrivateMessage(
      createPrivateMessageDto,
    );

    const user = await this.usersService.findOne(
      createPrivateMessageDto.receiverName,
    );

    client.emit('privateMessageForSender', newPrivateMessage);
    client
      .to(user.socketID)
      .emit('privateMessageForResiever', newPrivateMessage);

    const receiverName = await this.usersService.findOne(
      createPrivateMessageDto.receiverName,
    );

    if (receiverName.targetForMessage === createPrivateMessageDto.senderName) {
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

  @SubscribeMessage('selectUserForMessage')
  async handleSelectUserForMessage(
    @MessageBody() { receiverName, senderName }: RemoveSenderNameMessageForWho,
  ) {
    await this.usersService.selectUserForMessage(senderName, receiverName);
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
    // console.log('from getAllPrivateMessages server: ', createPrivateMessageDto);
    const { receiverName, senderName } = createPrivateMessageDto;
    const allPrivateMessages = await this.messagesService.findPrivateMessagesBy(
      senderName,
      receiverName,
    );
    client.emit('privateMessagesForClients', allPrivateMessages);
  }

  @SubscribeMessage('getAllUsers')
  async getAllUsers(): Promise<void> {
    const users = await this.messagesService.findAllUsers();
    const serializeUsers = users.map((user) => {
      user.password = null;
      return user;
    });
    this.server.emit('getAllUsers', serializeUsers);
  }

  // in this keys we must in user store find user to socketID
  // and turn status --> ofline and remove socketID
  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client disconnected: ${client.id}`);
    await this.usersService.setStatusUserToOffline(client.id);

    const users = await this.messagesService.findAllUsers();
    this.server.emit('getAllUsers', users);

    // when we are living from online we must overwrite the user.targetForMessage
    const user = await this.usersService.findOneBySocketID(client.id);
    if (user !== null) {
      user.targetForMessage = 'all';
      await this.usersService.update(user);
    }
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // @SubscribeMessage('typing')
  // async typing(
  //   @MessageBody('isTyping') isTyping: boolean,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const name = await this.messagesService.getClientName(client.id);

  //   client.broadcast.emit('typing', { name, isTyping });
  // }
}
