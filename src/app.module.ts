import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
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
import { AcademicModule } from './academic/academic.module';
import { ClassModule } from './class/class.module';
import { GradeModule } from './grade/grade.module';
import { ActivityModule } from './activity/activity.module';
import { ScheduleModule as ScheduleStudentModule } from './schedule/schedule.module';
import { ProfessorModule } from './professor/professor.module';
import { StudentModule } from './student/student.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/avatars'),
      serveRoot: '/avatar',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/classes-photos'),
      serveRoot: '/class-photo',
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    AcademicModule,
    ClassModule,
    GradeModule,
    ActivityModule,
    ScheduleStudentModule,
    ProfessorModule,
    StudentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
