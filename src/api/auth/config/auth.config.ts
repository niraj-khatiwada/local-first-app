import { IsMs } from '@/decorators/validators/is-ms.decorator';
import validateConfig from '@/utils/config/validate-config';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthConfig } from './auth-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  AUTH_JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  @IsMs()
  AUTH_JWT_TOKEN_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  AUTH_REFRESH_SECRET: string;

  @IsString()
  @IsNotEmpty()
  @IsMs()
  AUTH_REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  AUTH_FORGOT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  @IsMs()
  AUTH_FORGOT_TOKEN_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  AUTH_CONFIRM_EMAIL_SECRET: string;

  @IsString()
  @IsNotEmpty()
  @IsMs()
  AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN: string;
}

export function getConfig(): AuthConfig {
  return {
    secret: process.env.AUTH_JWT_SECRET,
    expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    refreshSecret: process.env.AUTH_REFRESH_SECRET,
    refreshExpiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    forgotSecret: process.env.AUTH_FORGOT_SECRET,
    forgotExpiresIn: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN,
    confirmEmailSecret: process.env.AUTH_CONFIRM_EMAIL_SECRET,
    confirmEmailExpiresIn: process.env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
  };
}

export default registerAs<AuthConfig>('auth', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering AuthConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});
