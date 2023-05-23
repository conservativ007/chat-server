import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly httpService: HttpService,
  ) {}

  async fileUpload(file: Express.Multer.File, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user === null) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

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
    return data.data.url;
  }
}
