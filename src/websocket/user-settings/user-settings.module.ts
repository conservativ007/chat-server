import { Module } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsGateway } from './user-settings.gateway';
import { UserEntity } from '../../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../../users/users.module';
import { MessagesModule } from '../../websocket/messages/messages.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  providers: [UserSettingsGateway, UserSettingsService],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UsersModule,
    MessagesModule,
    AuthModule,
  ],
})
export class UserSettingsModule {}
