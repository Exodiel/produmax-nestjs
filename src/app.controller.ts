import { Controller, Get, Res, Req, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { Unprotected } from 'nest-keycloak-connect';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) { }
  @Get('/test')
  getHello(@Res() res: Response, @Req() req: Request) {
    const hello = this.appService.getHello();
    return res.json({
      hello,
    });
  }

  @Post('upload/file')
  @UseInterceptors(FileInterceptor('file'))
  @Unprotected()
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.appService.uploadFile(file);
  }
}
