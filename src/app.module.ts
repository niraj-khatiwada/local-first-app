import authConfig from '@/api/auth/config/auth.config';
import appConfig from '@/config/app.config';
import databaseConfig from '@/database/config/database.config';
import mailConfig from '@/shared/mail/config/mail.config';
import redisConfig from '@/tools/redis/redis.config';
import { BullBoardModule } from '@bull-board/nestjs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';

import { FastifyAdapter } from '@bull-board/fastify';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { ApiModule } from './api/api.module';
import { default as useGraphqlFactory } from './graphql/graphql.factory';
import { default as useI18nFactory } from './i18n/i18n.factory';
import { default as awsConfig } from './services/aws/aws.config';
import { CacheModule as CacheManagerModule } from './shared/cache/cache.module';
import { MailModule } from './shared/mail/mail.module';
import { SocketModule } from './shared/socket/socket.module';
import grafanaConfig from './tools/grafana/config/grafana.config';
import { default as useLoggerFactory } from './tools/logger/logger-factory';
import { default as sentryConfig } from './tools/sentry/sentry.config';
import { default as throttlerConfig } from './tools/throttler/throttler.config';
import { default as useThrottlerFactory } from './tools/throttler/throttler.factory';
import { AppThrottlerGuard } from './tools/throttler/throttler.guard';
import { default as bullConfig } from './worker/queues/bull.config';
import { default as useBullFactory } from './worker/queues/bull.factory';
import { WorkerModule } from './worker/worker.module';

@Module({})
export class AppModule {
  private static common(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            appConfig,
            databaseConfig,
            redisConfig,
            authConfig,
            mailConfig,
            bullConfig,
            sentryConfig,
            throttlerConfig,
            awsConfig,
            grafanaConfig,
          ],
          envFilePath: ['.env'],
        }),
        GracefulShutdownModule.forRoot({
          cleanup: (...args) => {
            // eslint-disable-next-line no-console
            console.log('App shutting down...', args);
          },
        }),
        LoggerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: useLoggerFactory,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: databaseConfig,
        }),
        BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: useBullFactory,
        }),
        PrometheusModule.register(),
        CacheManagerModule,
        MailModule,
      ],
    };
  }
  static main(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ...AppModule.common().imports,
        I18nModule.forRootAsync({
          resolvers: [
            { use: QueryResolver, options: ['lang'] },
            AcceptLanguageResolver,
            new HeaderResolver(['x-lang']),
          ],
          inject: [ConfigService],
          useFactory: useI18nFactory,
        }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
          driver: ApolloDriver,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: useGraphqlFactory,
        }),
        ThrottlerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: useThrottlerFactory,
        }),
        BullBoardModule.forRoot({
          route: '/queues',
          adapter: FastifyAdapter,
        }),
        ApiModule,
        SocketModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AppThrottlerGuard,
        },
      ],
    };
  }

  static worker(): DynamicModule {
    return {
      module: AppModule,
      imports: [...AppModule.common().imports, WorkerModule],
    };
  }
}
