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
    this.server.emit('messageTwo', createMessageDto);
  }

  @SubscribeMessage('getAllUsers')
  async getAllUsers() {
    console.log('from server getAllUsers');

    const users = await this.messagesService.findAllUsers();
    const serializeUsers = users.map((user) => {
      user.password = null;
      return user;
    });
    this.server.emit('getAllUsers', serializeUsers);
  }

  // in this keys we must in user store find user to socketID
  // and turn status --> ofline and remove socketID
  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    await this.usersService.setStatusUserToOffline(client.id);

    const users = await this.messagesService.findAllUsers();
    this.server.emit('getAllUsers', users);
    console.log(users);
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
