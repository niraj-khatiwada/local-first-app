import { RedisConfig } from '@/tools/redis/redis-config.type';
import { JobsOptions } from 'bullmq';

export type BullConfig = {
  prefix: string;
  redis: RedisConfig;
  defaultJobOptions: JobsOptions;
  bullBoard: {
    username: string;
    password: string;
  };
};
