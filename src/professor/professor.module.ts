import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { ClassModule } from 'src/class/class.module';
import { ScheduleModule } from 'src/schedule/schedule.module';

@Module({
  imports: [ClassModule, ScheduleModule],
  providers: [ProfessorService],
  controllers: [ProfessorController],
})
export class ProfessorModule {}
