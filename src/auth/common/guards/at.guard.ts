import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../auth.service';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;
    if (!authorization)
      throw new HttpException('the authorization isn"t corrected', 401);

    const [bearer, accessToken] = authorization.split(' ');

    if (bearer !== 'Bearer' || !accessToken)
      throw new HttpException('the authorization isn"t corrected', 401);

    const payload = await this.authService.verifyAccessToken(accessToken);
    request.user = payload;
    return true;
  }
}
