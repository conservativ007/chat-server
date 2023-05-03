import { Module } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsGateway } from './user-settings.gateway';
import { UserEntity } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from 'src/messages/messages.module';
import { AuthModule } from 'src/auth/auth.module';

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
