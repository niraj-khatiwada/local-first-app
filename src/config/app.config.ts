import { Environment, LogService } from '@/constants/app.constant';
import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
} from 'class-validator';
import kebabCase from 'lodash/kebabCase';
import process from 'node:process';
import validateConfig from '../utils/config/validate-config';
import { AppConfig } from './app-config.type';

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: typeof Environment;

  @IsBoolean()
  @IsOptional()
  IS_HTTPS: boolean;

  @IsBoolean()
  @IsOptional()
  IS_WORKER: boolean;

  @IsString()
  @IsNotEmpty()
  APP_NAME: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  APP_URL: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsNotEmpty()
  APP_PORT: number;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;

  @IsBoolean()
  @IsOptional()
  APP_DEBUG: boolean;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsBoolean()
  @IsOptional()
  APP_LOGGING: boolean;

  @IsString()
  @IsOptional()
  APP_LOG_LEVEL: string;

  @IsString()
  @IsEnum(LogService)
  @IsOptional()
  APP_LOG_SERVICE: string;

  @IsString()
  @Matches(
    /^(true|false|\*|([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)?(,([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)*$/,
  )
  @IsOptional()
  APP_CORS_ORIGIN: string;
}

export function getConfig(): AppConfig {
  const port = parseInt(process.env.APP_PORT, 10);

  return {
    nodeEnv: (process.env.NODE_ENV || Environment.DEVELOPMENT) as Environment,
    isHttps: process.env.IS_HTTPS === 'true',
    isWorker: process.env.IS_WORKER === 'true',
    name: process.env.APP_NAME,
    appPrefix: kebabCase(process.env.APP_NAME),
    url: process.env.APP_URL || `http://localhost:${port}`,
    port,
    workerPort: Number.parseInt(process.env.APP_WORKER_PORT, 10),
    debug: process.env.APP_DEBUG === 'true',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    appLogging: process.env.APP_LOGGING === 'true',
    logLevel: process.env.APP_LOG_LEVEL || 'warn',
    logService: process.env.APP_LOG_SERVICE || LogService.CONSOLE,
    corsOrigin: getCorsOrigin(),
  };
}

export default registerAs<AppConfig>('app', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering AppConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});

function getCorsOrigin() {
  const corsOrigin = process.env.APP_CORS_ORIGIN;
  if (corsOrigin === 'true') return true;
  if (corsOrigin === '*') return '*';
  if (!corsOrigin || corsOrigin === 'false') return false;

  const origins = corsOrigin.split(',').map((origin) => origin.trim());

  // localhost
  const localhost = origins
    ?.map((origin) =>
      origin?.startsWith('http://localhost')
        ? origin?.replace('http://localhost', 'http://127.0.0.1')
        : origin,
    )
    ?.filter((origin, index) => origin !== origins[index]);
  origins.push(...localhost);

  // www
  const wwwOrigins = origins
    ?.map((origin) =>
      origin?.startsWith('https://')
        ? origin?.replace('https://', 'https://www.')
        : origin,
    )
    ?.filter((origin, index) => origin !== origins[index]);
  origins.push(...wwwOrigins);
  return origins;
}
