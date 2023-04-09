import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { newOrmConfig } from './common/typeOrm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './common/exceptions/CustomExceptionFilter';

@Module({
  imports: [TypeOrmModule.forRoot(newOrmConfig), MessagesModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
