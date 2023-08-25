import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth routes')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginAuthDto) {
    const { data, token } = await this.authService.login(dto);
    return { message: 'Datos correctos', data, token };
  }
}
