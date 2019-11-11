import { Controller, Get, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, editFileName } from './utils/file-uploading';
import { diskStorage } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('image', {
    limits: {
      fileSize: 1 * 1000 * 1000,
    },
    fileFilter: imageFileFilter,
    storage: diskStorage({
      destination: './uploads',
      filename: editFileName,
    }),
  }))
  async uploadPhoto( @UploadedFile() file ) {
    const response =  {
      originalname : file.originalname,
      filename     : file.filename,
      filepath     : file.path,
    };
    return response;
  }
}
