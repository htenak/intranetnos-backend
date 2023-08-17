import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { PORT } from './config/constants';
import { initSwagger } from './app.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>(PORT), 10) || 5000;

  initSwagger(app);

  await app.listen(port);
}
bootstrap();
