import { Module, forwardRef } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { AcademicController } from './academic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career, Course, CourseType, Cycle } from './entities';
import { UserModule } from 'src/user/user.module';
import { ClassModule } from 'src/class/class.module';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Career, Cycle, CourseType, Course]),
    UserModule,
    ActivityModule,
    forwardRef(() => ClassModule), // importacion de este modo por dependecia circular
  ],
  providers: [AcademicService],
  controllers: [AcademicController],
  exports: [AcademicService],
})
export class AcademicModule {}
