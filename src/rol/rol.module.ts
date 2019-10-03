import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RolController } from './rol.controller';
import { RolService } from './rol.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './rol.entity';
import { VerifyTokenMiddleware } from '../middlewares/verifytoken.middleware';
import { VerifyRolMiddlware } from '../middlewares/verifyrol.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  controllers: [RolController],
  providers: [RolService],
  exports: [RolModule],
})
export class RolModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware, VerifyRolMiddlware('admin'))
      .forRoutes(RolController);
  }
}
