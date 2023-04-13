import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class UserAccessGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const { headers, params } = context.switchToHttp().getRequest();
      const { authorization } = headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      const user = this.jwtService.verify(token);
      if (user.id === Number(params.id)) {
        return true;
      } else {
        throw new ForbiddenException('Нет доступа');
      }
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      } else {
        throw new ForbiddenException('Нет доступа');
      }
    }
  }
}
