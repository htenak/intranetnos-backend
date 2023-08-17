import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_PORT,
  DB_USER,
} from './config/constants';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PersonModule } from './person/person.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>(DB_HOST),
        port: parseInt(config.get<string>(DB_PORT), 10),
        username: config.get<string>(DB_USER),
        password: config.get<string>(DB_PASS),
        database: config.get<string>(DB_NAME),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, //desactivar en producción
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UserModule,
    AuthModule,
    PersonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
