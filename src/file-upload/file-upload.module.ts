import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { LocalFile } from './entities/local-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, LocalFile]), HttpModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
