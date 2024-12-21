import validateConfig from '@/utils/config/validate-config';
import { registerAs } from '@nestjs/config';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import process from 'node:process';
import { SentryConfig } from './sentry-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  SENTRY_DSN: string;

  @IsBoolean()
  @IsOptional()
  SENTRY_LOGGING: boolean;
}

export function getConfig(): SentryConfig {
  return {
    dsn: process.env.SENTRY_DSN,
    logging: process.env.SENTRY_LOGGING === 'true',
  };
}

export default registerAs<SentryConfig>('sentry', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering SentryConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});
