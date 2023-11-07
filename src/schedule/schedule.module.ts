import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Day, Schedule } from './entities';
import { DayInitializerProvider } from './initializer';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports: [TypeOrmModule.forFeature([Day, Schedule]), ClassModule],
  providers: [ScheduleService, DayInitializerProvider],
  controllers: [ScheduleController],
  exports: [ScheduleService],
})
export class ScheduleModule {}
