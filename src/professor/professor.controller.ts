import { Controller, Get, HttpStatus, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClassService } from 'src/class/class.service';
import { AuthAndRoles } from 'src/common/decorators';
import { ROLE } from 'src/config/constants';

@ApiTags('Professor routes')
@Controller('professor')
export class ProfessorController {
  constructor(private readonly classService: ClassService) {}

  // obtiene clases del profesor
  @AuthAndRoles(ROLE.professor)
  @Get('classes')
  async getClassesProfessor(@Request() req: any) {
    const data = await this.classService.getClassesProfessor(req.user.sub);
    return { statusCode: HttpStatus.OK, data };
  }
}
