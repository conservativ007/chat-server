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
import { UsersService } from '../../users/users.service';
import { RemoveSenderNameMessageForWho } from './dto/remove-sender-name-message-for-who.dto';
import { AuthService } from '../../auth/auth.service';
import { EMITS } from '../../common/emits';

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
    private readonly authService: AuthService,
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
    await this.usersService.selectUserForMessage(senderName, receiverName);

    const user = await this.usersService.findOneByUserLogin(senderName);
    return user;
  }

  // in this keys we must in user store find user to socketID
  // and turn status --> ofline
  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client disconnected: ${client.id}`);

    // pass the socketID
    await this.authService.logout(client.id, true);

    const users = await this.usersService.getAll();
    this.server.emit(EMITS.GET_ALL_USERS, users);
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
