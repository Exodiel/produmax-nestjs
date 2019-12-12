import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { JwtMiddleware } from '../middlewares/jwt.middlware';
import { RolMiddleware } from '../middlewares/rol.middleware';
import { Image } from '../image/image.entity';
import { ImageService } from '../image/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Image])],
  controllers: [CategoryController],
  providers: [CategoryService, ImageService],
  exports: [CategoryService],
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, RolMiddleware)
      .exclude(
        { path: 'categories/', method: RequestMethod.GET },
        { path: 'categories/single-category', method: RequestMethod.GET },
      )
      .forRoutes(
        { path: 'categories/update', method: RequestMethod.PUT },
        { path: 'categories/delete', method: RequestMethod.DELETE },
        { path: 'categories/', method: RequestMethod.POST },
        { path: 'categories/search-by-name', method: RequestMethod.GET },
        { path: 'categories/counter', method: RequestMethod.GET },
      );
  }
}
