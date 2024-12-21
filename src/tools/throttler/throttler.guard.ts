import { ContextType, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const type: ContextType & 'graphql' = context.getType();
    if (type === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext();
      return { req: ctx.req, res: ctx.res };
    }
    return super.getRequestResponse(context);
  }

  protected async getTracker(req: FastifyRequest): Promise<string> {
    const proxyIp =
      req?.headers['X-Forwarded'] ??
      req?.headers['x-forwarded'] ??
      req?.headers['X-Forwarded-For'] ??
      req?.headers['x-forwarded-for'] ??
      req?.headers?.['X-Real-IP'] ??
      req?.headers?.['x-real-ip'];

    return (proxyIp ?? req?.ips?.length) ? req?.ips[0] : req?.ip;
  }
}
