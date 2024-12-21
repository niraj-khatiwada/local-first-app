import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as Sentry from '@sentry/node';
import helmet from 'helmet';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import * as swaggerStats from 'swagger-stats';

import { AppModule } from './app.module';
import { getConfig as getAppConfig } from './config/app.config';
import { type GlobalConfig } from './config/global-config.type';
import { Environment } from './constants/app.constant';
import { RedisIoAdapter } from './shared/socket/redis.adapter';
import { consoleLoggingConfig } from './tools/logger/logger-factory';
import { SentryInterceptor } from './tools/sentry/sentry.interceptor';
import setupSwagger from './tools/swagger/swagger.setup';

async function bootstrap() {
  const envToLogger: Record<`${Environment}`, any> = {
    local: consoleLoggingConfig(),
    development: consoleLoggingConfig(),
    production: true,
    staging: true,
    test: false,
  } as const;

  const appConfig = getAppConfig();

  const isWorker = appConfig.isWorker;

  const app = await NestFactory.create<NestFastifyApplication>(
    isWorker ? AppModule.worker() : AppModule.main(),
    new FastifyAdapter({
      logger: appConfig.appLogging ? envToLogger[appConfig.nodeEnv] : false,
      trustProxy: appConfig.isHttps,
    }),
    {
      bufferLogs: true,
    },
  );
  const configService = app.get(ConfigService<GlobalConfig>);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });

  Sentry.init({
    dsn: configService.getOrThrow('sentry.dsn', { infer: true }),
    tracesSampleRate: 1.0,
    environment: configService.getOrThrow('app.nodeEnv', { infer: true }),
  });

  app.use(helmet());
  app.enableCors({
    origin: configService.getOrThrow('app.corsOrigin', {
      infer: true,
    }),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalInterceptors(new SentryInterceptor());

  const env = configService.getOrThrow('app.nodeEnv', { infer: true });

  const document = setupSwagger(app);

  app.use(
    swaggerStats.getMiddleware({
      name: configService.getOrThrow('app.name', { infer: true }),
      swaggerSpec: document,
      authentication: true,
      onAuthenticate(_, username: string, password: string) {
        return (
          username ===
            configService.getOrThrow('grafana.username', { infer: true }) &&
          password ===
            configService.getOrThrow('grafana.password', { infer: true })
        );
      },
    }),
  );

  if (env !== 'local') {
    setupGracefulShutdown({ app });
  }

  if (!isWorker) {
    app.useWebSocketAdapter(new RedisIoAdapter(app));
  }

  await app.listen({
    port: isWorker
      ? configService.getOrThrow('app.workerPort', { infer: true })
      : configService.getOrThrow('app.port', { infer: true }),
    host: '0.0.0.0',
  });

  const httpUrl = await app.getUrl();
  // eslint-disable-next-line no-console
  console.info(
    `\x1b[3${isWorker ? '3' : '4'}m${isWorker ? 'Worker ' : ''}Server running at ${httpUrl}`,
  );

  return app;
}

void bootstrap();
