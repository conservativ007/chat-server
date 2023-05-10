import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/websocket/messages/entities/message.entity';
import { PrivateMessageEntity } from 'src/websocket/messages/entities/privateMessage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, PrivateMessageEntity])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
