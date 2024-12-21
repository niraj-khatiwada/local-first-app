import validateConfig from '@/utils/config/validate-config';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import { GrafanaConfig } from './grafana.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  GRAFANA_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  GRAFANA_PASSWORD: string;
}

export function getConfig(): GrafanaConfig {
  return {
    username: process.env.GRAFANA_USERNAME,
    password: process.env.GRAFANA_PASSWORD,
  };
}

export default registerAs<GrafanaConfig>('grafana', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering GrafanaConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});
