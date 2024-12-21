import { JwtPayloadType } from '@/api/auth/types/jwt-payload.type';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type FastifyRequest } from 'fastify';

export const CurrentUser = createParamDecorator<
  keyof JwtPayloadType,
  ExecutionContext,
  JwtPayloadType | JwtPayloadType[keyof JwtPayloadType]
>((field, ctx) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>();
  const user: JwtPayloadType = request['user']; // request['user'] is set in the AuthGuard
  return field ? user?.[field] : user;
});
