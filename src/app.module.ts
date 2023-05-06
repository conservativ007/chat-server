import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { newOrmConfig } from './common/typeOrm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './common/exceptions/AllExceptionsFilter';
import { AtGuard } from './auth/common/guards';
import { CustomExceptionFilter } from './common/exceptions/CustomExceptionFilter';

@Module({
  imports: [
    TypeOrmModule.forRoot(newOrmConfig),
    ConfigModule.forRoot(),
    MessagesModule,
    UsersModule,
    UserSettingsModule,
    FileUploadModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
