import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Category } from '../category/category.entity';
import { Unit } from '../unit/unit.entity';
import { CategoryService } from '../category/category.service';
import { UnitService } from '../unit/unit.service';
import { VerifyTokenMiddleware } from '../middlewares/verifytoken.middleware';
import { VerifyRolMiddlware } from '../middlewares/verifyrol.middleware';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Unit])],
  controllers: [ProductController],
  providers: [ProductService, CategoryService, UnitService, AppGateway],
  exports: [ProductModule],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware, VerifyRolMiddlware('admin'))
      .forRoutes(
        { path: 'products/create', method: RequestMethod.POST },
        { path: 'products/delete', method: RequestMethod.DELETE },
        { path: 'products/update', method: RequestMethod.PUT },
      );
  }
}
