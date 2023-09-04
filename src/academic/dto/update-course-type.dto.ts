import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseTypeDto } from './create-course-type.dto';

export class UpdateCourseTypeDto extends PartialType(CreateCourseTypeDto) {}
