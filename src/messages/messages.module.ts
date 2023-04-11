import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { MessageEntity } from './entities/message.entity';
import { UsersModule } from 'src/users/users.module';
import { PrivateMessageEntity } from './entities/privateMessage.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([MessageEntity, UserEntity, PrivateMessageEntity]),
  ],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
