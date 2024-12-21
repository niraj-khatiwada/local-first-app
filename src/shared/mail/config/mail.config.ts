import { registerAs } from '@nestjs/config';

import validateConfig from '@/utils/config/validate-config';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { MailConfig } from './mail-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  MAIL_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  MAIL_PORT: number;

  @IsString()
  @IsOptional()
  MAIL_USER: string;

  @IsString()
  @IsOptional()
  MAIL_PASSWORD: string;

  @IsBoolean()
  MAIL_IGNORE_TLS: boolean;

  @IsBoolean()
  MAIL_SECURE: boolean;

  @IsBoolean()
  MAIL_REQUIRE_TLS: boolean;

  @IsEmail()
  MAIL_DEFAULT_EMAIL: string;

  @IsString()
  MAIL_DEFAULT_NAME: string;
}

export function getConfig(): MailConfig {
  return {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
    secure: process.env.MAIL_SECURE === 'true',
    requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
    defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
    defaultName: process.env.MAIL_DEFAULT_NAME,
  };
}

export default registerAs<MailConfig>('mail', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering MailConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});
