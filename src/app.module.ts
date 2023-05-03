import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { newOrmConfig } from './common/typeOrm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './common/exceptions/CustomExceptionFilter';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { UserEntity } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

// import { getEnvPath } from './common/env.helper';

// const envFilePath: string = getEnvPath(`${__dirname}/common`);
// console.log(envFilePath);

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
    // {
    //   provide: APP_FILTER,
    //   useClass: CustomExceptionFilter,
    // },
  ],
})
export class AppModule {}
