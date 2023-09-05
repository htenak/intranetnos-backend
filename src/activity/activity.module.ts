import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity, ActivityType } from './entities';
import { AcademicModule } from 'src/academic/academic.module';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityType, Activity]), AcademicModule],
  providers: [ActivityService],
  controllers: [ActivityController],
})
export class ActivityModule {}
