import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { JwtMiddleware } from '../middlewares/jwt.middlware';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(
        {
          path: 'image/upload', method: RequestMethod.POST,
        },
        {
          path: 'image/delete', method: RequestMethod.DELETE,
        },
      );
  }

}
