import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { diskStorage } from 'multer';

@Controller('file-upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post('avatar/:id')
  @UseInterceptors(FileInterceptor('file'))
  async handleUploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param() { id },
  ) {
    await this.fileUploadService.checkUser(id);

    let response = await this.fileUploadService.fileUpload(file);
    // response = JSON.stringify(response);
    return response;
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async handleUploadFileImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    let response = await this.fileUploadService.fileUpload(file);
    return response;
  }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('any-file', {
      storage: diskStorage({
        destination: 'src/file-upload/uploaded-files',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async handleUploadAnyFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          // new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const dto = {
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
    };

    return await this.fileUploadService.saveLocalFileData(dto);
  }
}
