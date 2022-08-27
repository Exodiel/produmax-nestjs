import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'
import { UnitModule } from './unit/unit.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { RolModule } from './rol/rol.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { AppGateway } from './app.gateway';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { RolMiddleware } from './middlewares/rol.middleware';
import { JwtMiddleware } from './middlewares/jwt.middlware';

@Module({
  imports: [
    CategoryModule,
    SubCategoryModule,
    UnitModule,
    ProductModule,
    RolModule,
    UserModule,
    AuthModule,
    OrderModule,
    SubCategoryModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: +process.env.PORT,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      host: process.env.HOST,
      charset: process.env.COLLATION,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      subscribers: [__dirname + '/**/**/subscriber/*{.ts,.js}'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule implements NestModule {
  constructor() {
    console.log('first', process.env.PORT)
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware, RolMiddleware).forRoutes(
      { path: 'app/upload', method: RequestMethod.POST },
    );
  }
}
