import { Details } from './details.entity';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { JwtMiddleware } from '../middlewares/jwt.middlware';
import { RolMiddleware } from '../middlewares/rol.middleware';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Details, Product, User])],
  controllers: [OrderController],
  providers: [OrderService, AppGateway],
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, RolMiddleware)
      .exclude(
        { path: 'order/', method: RequestMethod.GET },
        { path: 'order/single', method: RequestMethod.GET },
        { path: 'order/search-by-date', method: RequestMethod.GET },
        { path: 'order/create', method: RequestMethod.POST },
      )
      .forRoutes(OrderController);
  }
}
