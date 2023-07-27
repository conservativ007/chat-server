import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { LocalFile } from './entities/local-file.entity';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly httpService: HttpService,
    @InjectRepository(LocalFile)
    private localFilesRepository: Repository<LocalFile>,
  ) {}

  async checkUser(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user === null) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
  }

  async fileUpload(file: Express.Multer.File) {
    const API_KEY = '3b611871870b0f2b7976d09503b67257';

    const formData = new FormData();
    formData.append('image', file.buffer.toString('base64'));
    const { data } = await firstValueFrom(
      this.httpService
        .post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData)
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );

    return {
      type: 'image',
      imageUrl: data.data.url,
    };
  }

  async saveLocalFileData(fileData: localFileDto) {
    const newFile = this.localFilesRepository.create(fileData);
    await this.localFilesRepository.save(newFile);

    return {
      type: 'file',
      fileId: newFile.id,
      fileName: fileData.filename,
    };
  }

  async getFileById(id: number) {
    const file = this.localFilesRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException();
    }

    return file;
  }
}
