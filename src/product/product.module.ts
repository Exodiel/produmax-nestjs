import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Unit } from '../unit/unit.entity';
import { UnitService } from '../unit/unit.service';
import { JwtMiddleware } from '../middlewares/jwt.middlware';
import { RolMiddleware } from '../middlewares/rol.middleware';
import { AppGateway } from '../app.gateway';
import { SubCategory } from '../sub-category/sub.category.entity';
import { SubCategoryService } from '../sub-category/sub-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, SubCategory, Unit])],
  controllers: [ProductController],
  providers: [ProductService, UnitService, SubCategoryService, AppGateway],
  exports: [ProductService],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, RolMiddleware)
      .exclude(
        { path: 'products/', method: RequestMethod.GET },
        { path: 'products/single', method: RequestMethod.GET },
        { path: 'products/search-name', method: RequestMethod.GET },
        { path: 'products/single/unit', method: RequestMethod.GET },
        { path: 'products/single/subcategory', method: RequestMethod.GET },
      )
      .forRoutes(
        { path: 'products/create', method: RequestMethod.POST },
        { path: 'products/delete', method: RequestMethod.DELETE },
        { path: 'products/update', method: RequestMethod.PUT },
        { path: 'products/counter', method: RequestMethod.GET },
      );
  }
}
