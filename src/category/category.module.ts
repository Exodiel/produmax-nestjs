import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { VerifyTokenMiddleware } from '../middlewares/verifytoken.middleware';
import { VerifyRolMiddlware } from '../middlewares/verifyrol.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryModule],
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware, VerifyRolMiddlware('admin'))
      .forRoutes(CategoryController);
  }
}
