import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Rol } from '../rol/rol.entity';
import { RolService } from '../rol/rol.service';
import {VerifyRolMiddlware} from '../middlewares/verifyrol.middleware';
import { VerifyTokenMiddleware } from '../middlewares/verifytoken.middleware';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rol])],
  controllers: [UserController],
  providers: [UserService, RolService, AppGateway],
  exports: [UserModule],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware, VerifyRolMiddlware('admin'))
      .forRoutes(UserController);
  }
}
