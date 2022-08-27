import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../passport/jwt.strategy';
import { RolModule } from '../rol/rol.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Rol } from '../rol/rol.entity';
import { JwtMiddleware } from '../middlewares/jwt.middlware';
import { AppGateway } from '../app.gateway';
import { UserService } from '../user/user.service';
import { RolService } from '../rol/rol.service';
import { Session } from '../session/session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Rol, Session]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN },
    }),
    UserModule,
    RolModule,
  ],
  providers: [AuthService, JwtStrategy, UserService, RolService, AppGateway],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(
      { path: 'auth/logout', method: RequestMethod.POST },
    );
  }
}
