import { Unit } from './unit.entity';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyRolMiddlware } from '../middlewares/verifyrol.middleware';
import { VerifyTokenMiddleware } from '../middlewares/verifytoken.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Unit])],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitModule],
})
export class UnitModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware, VerifyRolMiddlware('admin'))
      .forRoutes(UnitController);
  }
}
