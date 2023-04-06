import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { newOrmConfig } from './common/typeOrm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(newOrmConfig), MessagesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
