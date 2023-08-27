import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { JwtMiddleware } from '../middlewares/jwt.middlware';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
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
