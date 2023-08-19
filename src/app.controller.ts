import { Controller, Get, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
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
}
