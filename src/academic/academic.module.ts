import { Module } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { AcademicController } from './academic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career, Course, CourseType, Cycle } from './entities';
import { User } from 'src/user/entities';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Career, Cycle, CourseType, Course]),
    UserModule,
  ],
  providers: [AcademicService],
  controllers: [AcademicController],
  exports: [AcademicService],
})
export class AcademicModule {}
