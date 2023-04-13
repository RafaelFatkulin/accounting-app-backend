import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WalletsGuard implements CanActivate {
  constructor(
    private readonly walletsService: WalletsService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const { headers, params } = context.switchToHttp().getRequest();
      const { authorization } = headers;
      const wallet = await this.walletsService.findOne(params.id);
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      const user = await this.jwtService.verify(token);

      if (user.id === wallet.userId) {
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
