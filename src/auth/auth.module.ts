import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { RolModule } from '../rol/rol.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Rol } from '../rol/rol.entity';
import { JwtMiddleware } from '../middlewares/jwt.middlware';
import { jwtConstant } from './constant';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Rol]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstant.secret,
      signOptions: { expiresIn: 60 * 60 * 24 },
    }),
    UserModule,
    RolModule,
  ],
  providers: [AuthService, JwtStrategy, AppGateway],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes( { path: 'auth/logout', method: RequestMethod.GET } );
  }
}
