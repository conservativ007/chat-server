import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UserSettingsService } from './user-settings.service';
import { SetUserAvatarDTO } from './dto/set-user-avatar-settings.dto';

import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RemoveSenderNameMessageForWho } from './dto/removeSenderNameMessageForWho.dto';
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserSettingsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userSettingsService: UserSettingsService,
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
  ) {}
  private logger: Logger = new Logger('UserSettingsGateway');

  @SubscribeMessage('setUserAvatar')
  setUserAvatar(@MessageBody() setUserAvatar: SetUserAvatarDTO) {
    const { avatar, userId } = setUserAvatar;
    const updatedUser = this.userSettingsService.changeUserAvatar(
      userId,
      avatar,
    );
    return updatedUser;
  }

  @SubscribeMessage('selectUserForMessage')
  async handleSelectUserForMessage(
    @MessageBody() { receiverName, senderName }: RemoveSenderNameMessageForWho,
  ) {
    console.log('selectUserForMessage');
    console.log(receiverName, senderName);
    await this.usersService.selectUserForMessage(senderName, receiverName);

    const user = await this.usersService.findOne(senderName);
    return user;
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
}
