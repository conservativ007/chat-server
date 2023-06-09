import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../../users/users.service';
import { IPrivateMessage } from 'src/common/types/interfaces';
import { MessageEntity } from './entities/message.entity';
import { RemoveSenderNameMessageForWho } from '../user-settings/dto/remove-sender-name-message-for-who.dto';
import { LastMessageForUsersDto } from './dto/last.message.for.users.dto';
import { EMITS } from '../../common/emits';
import { DeletePrivateMessageDto } from './dto/delete-message.dto';

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
  async handleMessage(@MessageBody() dto: MessageEntity): Promise<void> {
    this.server.emit(EMITS.CREATE_MESSAGE_FOR_GENERAL_CHAT, dto);
  }

  @SubscribeMessage(EMITS.CREATE_PRIVATE_MESSAGE)
  async handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: MessageEntity,
  ): Promise<void> {
    // console.log(dto);
    const receiverUser = await this.usersService.findOneByUserLogin(
      dto.receiverName,
    );
    client.to(receiverUser.socketID).emit(EMITS.CREATE_PRIVATE_MESSAGE, dto);

    if (receiverUser.targetForMessage === dto.senderName) {
      console.log(
        'receiverName.targetForMessage === createPrivateMessageDto.senderName',
      );
      return;
    }

    // set status unreadMessage to true and emit getAllUsers
    await this.usersService.addUserNameToMessageForWho(
      dto.senderName,
      dto.receiverName,
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
  async getAllMessages(): Promise<MessageEntity[]> {
    return await this.messagesService.findAllMessages();
  }

  // get all private messages for sender and resiever
  @SubscribeMessage(EMITS.GET_MESSAGES_FOR_PRIVATE_CHAT)
  async handleGetAllPrivateMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() createPrivateMessageDto: IPrivateMessage,
  ): Promise<void> {
    const { senderId, receiverId } = createPrivateMessageDto;
    const allPrivateMessages = await this.messagesService.findPrivateMessagesBy(
      senderId,
      receiverId,
    );
    client.emit(EMITS.GET_MESSAGES_FOR_PRIVATE_CHAT, allPrivateMessages);
  }

  @SubscribeMessage(EMITS.GET_ALL_USERS)
  async getAllUsers(): Promise<void> {
    const users = await this.usersService.getAll();
    this.server.emit(EMITS.GET_ALL_USERS, users);
  }

  @SubscribeMessage(EMITS.SET_LIKE_TO_MESSAGE)
  async lastMessageForUsers(
    @MessageBody() dto: LastMessageForUsersDto,
  ): Promise<void> {
    this.server.emit(EMITS.SET_LIKE_TO_MESSAGE, dto);
  }

  @SubscribeMessage(EMITS.UPDATE_PRIVATE_MESSAGE)
  async updateMessageForOneUser(
    @MessageBody() dto: MessageEntity,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const reciever = await this.usersService.findOneByUserLogin(
      dto.receiverName,
    );
    client.to(reciever.socketID).emit(EMITS.UPDATE_PRIVATE_MESSAGE, dto);
  }

  @SubscribeMessage(EMITS.UPDATE_MESSAGE_FOR_GENERAL_CHAT)
  async updateMessageForGeneralChat(
    @MessageBody() dto: MessageEntity,
  ): Promise<void> {
    this.server.emit(EMITS.UPDATE_MESSAGE_FOR_GENERAL_CHAT, dto);
  }

  @SubscribeMessage(EMITS.DELETE_PRIVATE_MESSAGE)
  async deleteMessageForOneUser(
    @MessageBody() dto: DeletePrivateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const reciever = await this.usersService.findOneById(dto.recieverId);
    client
      .to(reciever.socketID)
      .emit(EMITS.DELETE_PRIVATE_MESSAGE, dto.messageId);
  }

  @SubscribeMessage(EMITS.DELETE_MESSAGE_FOR_GENERAL_CHAT)
  async deleteMessageForGeneralChat(
    @MessageBody() messageId: string,
  ): Promise<void> {
    this.server.emit(EMITS.DELETE_MESSAGE_FOR_GENERAL_CHAT, messageId);
  }
}
