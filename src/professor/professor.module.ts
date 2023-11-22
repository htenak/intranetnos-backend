import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';

import { ClassModule } from 'src/class/class.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { Career, Cycle } from 'src/academic/entities';
import { User } from 'src/user/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Career, Cycle, User]),
    ClassModule,
    ScheduleModule,
  ],
  providers: [ProfessorService],
  controllers: [ProfessorController],
  exports: [ProfessorService],
})
export class ProfessorModule {}
