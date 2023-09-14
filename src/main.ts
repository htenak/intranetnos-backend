import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { APP_HOST, APP_PORT } from './config/constants';
import { initSwagger } from './app.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>(APP_PORT), 10) || 5000;
  const host = config.get<string>(APP_HOST);

  initSwagger(app);

  app.enableCors({
    origin: '*', // peticiones de cualquier direccion (*)
    methods: 'GET,POST,PUT,DELETE',
  });

  app.useGlobalPipes(new ValidationPipe()); // importante para que funcione class-validator

  await app.listen(port, host);
}
bootstrap();
