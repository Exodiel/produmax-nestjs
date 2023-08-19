import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify'

const port = process.env.PORT_SERVER || 4000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(helmet());
  /*app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );*/

  await app.listen(port);
}
bootstrap();
