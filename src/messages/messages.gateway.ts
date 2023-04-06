import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}
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
    // console.log('from server getAllUsers');

    const users = await this.messagesService.findAllUsers();
    this.server.emit('getAllUsers', users);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
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
