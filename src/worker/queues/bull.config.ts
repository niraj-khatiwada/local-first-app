import { RedisConfig } from '@/tools/redis/redis-config.type';
import redisConfig from '@/tools/redis/redis.config';
import validateConfig from '@/utils/config/validate-config';
import { registerAs } from '@nestjs/config';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import kebabCase from 'lodash/kebabCase';
import { BullConfig } from './bull-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  APP_NAME: string;

  @IsBoolean()
  @IsOptional()
  QUEUE_REMOVE_ON_COMPLETE: boolean;

  @IsNumber()
  @IsOptional()
  RETRY_ATTEMPTS_ON_FAIL: number;

  @IsString()
  @IsOptional()
  BULL_BOARD_USERNAME: string;

  @IsString()
  @IsOptional()
  BULL_BOARD_PASSWORD: string;
}

export function getConfig() {
  return {
    prefix: `bull-${kebabCase(process.env.APP_NAME)}`,
    redis: redisConfig() as RedisConfig,
    defaultJobOptions: {
      removeOnComplete: process.env.QUEUE_REMOVE_ON_COMPLETE === 'true',
      removeOnFail: process.env.QUEUE_REMOVE_ON_FAIL === 'true',
      attempts: process.env.QUEUE_FAILED_RETRY_ATTEMPTS
        ? Number.parseInt(process.env.QUEUE_FAILED_RETRY_ATTEMPTS)
        : 0,
      backoff: {
        type: 'exponential', // With an exponential backoff, it will retry after 2 ^ attempts * delay milliseconds
        delay: 1000,
      },
    },
    bullBoard: {
      username: process.env.BULL_BOARD_USERNAME,
      password: process.env.BULL_BOARD_PASSWORD,
    },
  };
}

export default registerAs<BullConfig>('queue', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering BullConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});
