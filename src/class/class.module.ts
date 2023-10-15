import { Module, forwardRef } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class, StudentClass } from './entities';
import { AcademicModule } from 'src/academic/academic.module';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, StudentClass]),
    forwardRef(() => AcademicModule), // por dependecia circular
  ],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}
