import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class, StudentClass } from './entities';
import { AcademicModule } from 'src/academic/academic.module';

@Module({
  imports: [TypeOrmModule.forFeature([Class, StudentClass]), AcademicModule],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}
