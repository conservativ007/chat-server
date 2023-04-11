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
import { PrivateMessageEntity } from './entities/privateMessage.entity';
import { IPrivateMessage } from 'src/common/types/interfaces';

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

  @SubscribeMessage('createMessage')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
  ): Promise<void> {
    console.log('server side payload');
    console.log(createMessageDto);
    await this.messagesService.createMessage(createMessageDto);
    this.server.emit('message', createMessageDto);
  }

  @SubscribeMessage('createPrivateMessage')
  async handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createPrivateMessageDto: CreatePrivateMessageDto,
  ): Promise<void> {
    const newPrivateMessage = await this.messagesService.createPrivateMessage(
      createPrivateMessageDto,
    );

    client.emit('privateMessageForClient', newPrivateMessage);

    // this.server.emit('privateMessage', newPrivateMessage);
  }

  // get all messages
  @SubscribeMessage('getAllMessages')
  async getAllMessages(@MessageBody() data: unknown) {
    console.log('from getAllMessages: ', data);
    return await this.messagesService.findAllMessages();
  }

  // get all private messages for sender and resiever
  @SubscribeMessage('getAllPrivateMessages')
  async handleGetAllPrivateMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() createPrivateMessageDto: IPrivateMessage,
  ): Promise<void> {
    console.log('from getAllPrivateMessages server: ', createPrivateMessageDto);
    const { receiverName, senderName } = createPrivateMessageDto;
    const allPrivateMessages = await this.messagesService.findPrivateMessagesBy(
      senderName,
      receiverName,
    );
    client.emit('privateMessagesForClient', allPrivateMessages);
  }

  @SubscribeMessage('getAllUsers')
  async getAllUsers() {
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
  }

  handleConnection(client: Socket, ...args: any[]) {
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
