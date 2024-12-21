import validateConfig from '@/utils/config/validate-config';
import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { DatabaseConfig, DatabaseSSLMode } from './database-config.type';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.DATABASE_URL)
  @IsString()
  DATABASE_URL: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_HOST: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsInt()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_PASSWORD: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_NAME: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_USERNAME: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_LOGGING: boolean;

  @IsInt()
  @IsPositive()
  @IsOptional()
  DATABASE_MAX_CONNECTIONS: number;

  @IsOptional()
  @IsEnum(DatabaseSSLMode)
  DATABASE_SSL_MODE: DatabaseSSLMode;

  @IsBoolean()
  @IsOptional()
  DATABASE_REJECT_UNAUTHORIZED: boolean;

  @IsString()
  @IsOptional()
  DATABASE_CA: string;

  @IsString()
  @IsOptional()
  DATABASE_KEY: string;

  @IsString()
  @IsOptional()
  DATABASE_CERT: string;
}

export function getConfig(): DatabaseConfig {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    logging: process.env.DATABASE_LOGGING === 'true',
    dropSchema: false,
    poolSize: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,
    ssl:
      process.env.DATABASE_SSL_MODE === DatabaseSSLMode.require
        ? {
            rejectUnauthorized:
              process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
            ca: process.env.DATABASE_CA ?? undefined,
            key: process.env.DATABASE_KEY ?? undefined,
            cert: process.env.DATABASE_CERT ?? undefined,
          }
        : undefined,
    entities: [__dirname + '/../../**/entities/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    seeds: [__dirname + '/../seeds/**/*{.ts,.js}'],
    seedTracking: true,
    seedTableName: 'seeders',
    useUTC: true,
  };
}

export default registerAs<DatabaseConfig>('database', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering DatabaseConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});
