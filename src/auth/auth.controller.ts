import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthAndRoles } from 'src/common/decorators';
import { ROLE } from 'src/config/constants';

@ApiTags('Auth routes')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginAuthDto) {
    const { data, token } = await this.authService.login(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Datos correctos',
      data,
      token,
    };
  }

  @Get('renew/:token')
  async renewToken(@Param('token') accesToken: string) {
    const { data, token } = await this.authService.renewToken(accesToken);
    return { statusCode: HttpStatus.OK, data, token };
  }
}
