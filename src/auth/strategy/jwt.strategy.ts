import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from 'src/config/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      // trae el jwt Token desde el encabezado Bearer Token:
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // que no ignore la exp del token
      ignoreExpiration: false,
      // usa el secret para validar que fue generado por este backend
      secretOrKey: config.get<string>(JWT_SECRET),
    });
  }

  /*
   * lo que retorna este metodo es lo que veré al
   * extraer datos de req.user
   */
  validate(payload: any) {
    const { sub, username, role } = payload;
    if (!role) throw new UnauthorizedException('No tienes ningún rol asignado');
    return { sub, username, role };
  }
}
