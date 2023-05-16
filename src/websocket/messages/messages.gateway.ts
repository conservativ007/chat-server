import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { IPrivateMessage } from 'src/common/types/interfaces';
import { MessageEntity } from './entities/message.entity';
import { RemoveSenderNameMessageForWho } from '../user-settings/dto/removeSenderNameMessageForWho.dto';
import { LastMessageForUsersDto } from './dto/last.message.for.users.dto';
import { EMITS } from 'src/common/emits';

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

  @SubscribeMessage(EMITS.CREATE_MESSAGE_FOR_GENERAL_CHAT)
  async handleMessage(@MessageBody() dto: any): Promise<void> {
    this.server.emit(EMITS.CREATE_MESSAGE_FOR_GENERAL_CHAT, dto);
  }

  @SubscribeMessage(EMITS.CREATE_PRIVATE_MESSAGE)
  async handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: any,
  ): Promise<void> {
    const receiverUser = await this.usersService.findOneById(dto.recieverId);

    client
      .to(receiverUser.socketID)
      .emit(EMITS.CREATE_PRIVATE_MESSAGE, dto.message);

    if (receiverUser.targetForMessage === dto.message.senderName) {
      console.log(
        'receiverName.targetForMessage === createPrivateMessageDto.senderName',
      );
      return;
    }

    // set status unreadMessage to true and emit getAllUsers
    await this.usersService.addUserNameToMessageForWho(
      dto.message.senderName,
      dto.message.receiverName,
    );
    await this.getAllUsers();
  }

  @SubscribeMessage(EMITS.REMOVE_NAME_FOR_MESSAGE_TO)
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
  @SubscribeMessage(EMITS.GET_MESSAGES_FOR_GENERAL_CHAT)
  async getAllMessages(@MessageBody() data: unknown): Promise<MessageEntity[]> {
    // console.log('from getAllMessages: ', data);
    return await this.messagesService.findAllMessages();
  }

  // get all private messages for sender and resiever
  @SubscribeMessage(EMITS.GET_MESSAGES_FOR_PRIVATE_CHAT)
  async handleGetAllPrivateMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() createPrivateMessageDto: IPrivateMessage,
  ): Promise<void> {
    const { receiverName, senderName } = createPrivateMessageDto;
    const allPrivateMessages = await this.messagesService.findPrivateMessagesBy(
      senderName,
      receiverName,
    );
    client.emit(EMITS.GET_MESSAGES_FOR_PRIVATE_CHAT, allPrivateMessages);
  }

  @SubscribeMessage(EMITS.GET_ALL_USERS)
  async getAllUsers(@MessageBody() myselfLogin?: string): Promise<void> {
    const users = await this.usersService.getAll();
    this.server.emit(EMITS.GET_ALL_USERS, users);
  }

  @SubscribeMessage(EMITS.SET_LIKE_TO_MESSAGE)
  async lastMessageForUsers(
    @MessageBody() dto: LastMessageForUsersDto,
  ): Promise<void> {
    this.server.emit(EMITS.SET_LIKE_TO_MESSAGE, dto);
  }

  @SubscribeMessage(EMITS.UPDATE_MESSAGE_FOR_ONE_USER)
  async updateMessageForOneUser(
    @MessageBody() dto: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const reciever = await this.usersService.findOneById(dto.recieverId);
    client
      .to(reciever.socketID)
      .emit(EMITS.UPDATE_MESSAGE_FOR_ONE_USER, dto.message);
  }

  @SubscribeMessage(EMITS.UPDATE_MESSAGE_FOR_GENERAL_CHAT)
  async updateMessageForGeneralChat(@MessageBody() dto: any): Promise<void> {
    this.server.emit(EMITS.UPDATE_MESSAGE_FOR_GENERAL_CHAT, dto.message);
  }

  @SubscribeMessage(EMITS.DELETE_MESSAGE_FOR_ONE_USER)
  async deleteMessageForOneUser(
    @MessageBody() dto: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const reciever = await this.usersService.findOneById(dto.recieverId);
    client
      .to(reciever.socketID)
      .emit(EMITS.DELETE_MESSAGE_FOR_ONE_USER, dto.messageId);
  }

  @SubscribeMessage(EMITS.DELETE_MESSAGE_FOR_GENERAL_CHAT)
  async deleteMessageForGeneralChat(@MessageBody() dto: any): Promise<void> {
    this.server.emit(EMITS.DELETE_MESSAGE_FOR_GENERAL_CHAT, dto.messageId);
  }
}
