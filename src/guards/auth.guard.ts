import { AuthService } from '@/api/auth/auth.service';
import { JwtPayloadType } from '@/api/auth/types/jwt-payload.type';
import { IS_AUTH_OPTIONAL, IS_PUBLIC } from '@/constants/app.constant';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type FastifyRequest } from 'fastify';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const isAuthOptional = this.reflector.getAllAndOverride<boolean>(
      IS_AUTH_OPTIONAL,
      [context.getHandler(), context.getClass()],
    );

    // ws
    if (context.getType() === 'ws') {
      const socket = context.switchToWs().getClient<Socket>();
      const [type, token] = socket.handshake?.auth?.['token']?.split(' ') ?? [];
      const accessToken = type === 'Bearer' ? token : undefined;
      let payload: JwtPayloadType;
      try {
        payload = await this.authService.verifyAccessToken(accessToken);
      } catch (_) {
        socket.disconnect();
        return false;
      }
      socket['user'] = payload;
      return true;
    }

    // http
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const [type, token] = request?.headers['authorization']?.split(' ') ?? [];
    const accessToken = type === 'Bearer' ? token : undefined;

    if (isAuthOptional && !accessToken) {
      return true;
    }
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    let payload: JwtPayloadType;
    try {
      payload = await this.authService.verifyAccessToken(accessToken);
    } catch (_) {
      throw new UnauthorizedException();
    }
    request['user'] = payload;

    return true;
  }
}
