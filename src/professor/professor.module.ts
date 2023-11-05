import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports: [ClassModule],
  providers: [ProfessorService],
  controllers: [ProfessorController],
})
export class ProfessorModule {}
