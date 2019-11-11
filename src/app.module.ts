import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { UnitModule } from './unit/unit.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { RolModule } from './rol/rol.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { AppGateway } from './app.gateway';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { JwtMiddleware } from './middlewares/jwt.middlware';
import { RolMiddleware } from './middlewares/rol.middleware';

@Module({
  imports: [CategoryModule, SubCategoryModule, UnitModule, ProductModule, RolModule, UserModule, AuthModule, TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      port: Number(configService.get('PORT')),
      username: configService.get('USERNAME'),
      password: configService.get('PASSWORD'),
      database: configService.get('DATABASE'),
      host: configService.get('HOST'),
      charset: configService.get('COLLATION'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      subscribers: [__dirname + '/**/**/subscriber/*{.ts,.js}'],
    }),
  }), OrderModule, SubCategoryModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, RolMiddleware)
      .forRoutes(
        { path: '/upload', method: RequestMethod.POST },
      );
  }
}
