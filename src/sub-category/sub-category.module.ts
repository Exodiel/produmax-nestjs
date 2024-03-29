import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './sub.category.entity';
import { JwtMiddleware } from '../middlewares/jwt.middlware';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [CategoryModule, TypeOrmModule.forFeature([SubCategory])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [SubCategoryService],
})
export class SubCategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'subcategories/', method: RequestMethod.GET },
        { path: 'subcategories/single', method: RequestMethod.GET },
        { path: 'subcategories/single/category', method: RequestMethod.GET },
        { path: 'subcategories/relationated', method: RequestMethod.GET },
      )
      .forRoutes(
        { path: 'subcategories/', method: RequestMethod.POST },
        { path: 'subcategories/update-subcategory', method: RequestMethod.PUT },
        { path: 'subcategories/delete-subcategory', method: RequestMethod.DELETE },
      );
  }

}
