import { GlobalConfig } from '@/config/global-config.type';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

async function useThrottlerFactory(config: ConfigService<GlobalConfig>) {
  return {
    throttlers: [
      {
        ttl: config.getOrThrow('throttler.ttl', { infer: true }),
        limit: config.getOrThrow('throttler.limit', { infer: true }),
      },
    ],
    storage: new ThrottlerStorageRedisService(
      new Redis(config.getOrThrow('redis')),
    ),
  };
}

export default useThrottlerFactory;
