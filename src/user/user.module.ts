import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Rol } from '../rol/rol.entity';
import { RolService } from '../rol/rol.service';
import { JwtMiddleware } from '../middlewares/jwt.middlware';
import { RolMiddleware } from '../middlewares/rol.middleware';
import { UserSubscriber } from './subscriber/UserSubscriber';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rol])],
  controllers: [UserController],
  providers: [UserService, RolService, UserSubscriber, AppGateway],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(UserController);

    consumer
      .apply(RolMiddleware)
      .forRoutes(
        { path: 'users/', method: RequestMethod.GET },
        { path: 'users/cedula', method: RequestMethod.GET },
        { path: 'users/counter', method: RequestMethod.GET },
        { path: 'users/create', method: RequestMethod.POST },
        { path: 'users/delete', method: RequestMethod.DELETE },
      );
  }
}
