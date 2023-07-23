import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './websocket/messages/messages.module';
import { newOrmConfig } from './common/typeOrm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { UserSettingsModule } from './websocket/user-settings/user-settings.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/common/guards';
import { CustomExceptionFilter } from './common/exceptions/CustomExceptionFilter';
import { LoggerModule } from './common/logger/logger.module';
import { LoggerMiddleware } from './common/logger/LoggerMiddleware';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(newOrmConfig),
    ConfigModule.forRoot(),
    MessagesModule,
    UsersModule,
    UserSettingsModule,
    FileUploadModule,
    AuthModule,
    LoggerModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
