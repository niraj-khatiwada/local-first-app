import { GlobalConfig } from '@/config/global-config.type';
import { CacheKey } from '@/constants/cache.constant';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import util from 'util';
import { CacheParam } from './cache.type';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService<GlobalConfig>,
  ) {}

  async get<T>(keyParams: CacheParam) {
    return this.cacheManager.get<T>(this._constructCacheKey(keyParams));
  }

  async set(
    keyParams: CacheParam,
    value: unknown,
    options?: {
      ttl?: number; // ms
    },
  ): Promise<{ key: string }> {
    const key = this._constructCacheKey(keyParams);
    await this.cacheManager.set(key, value, options?.ttl);
    return { key };
  }

  async storeGet<T>(keyParams: CacheParam) {
    return this.cacheManager.store.get<T>(this._constructCacheKey(keyParams));
  }

  async storeSet<T>(
    keyParams: CacheParam,
    value: T,
    options?: {
      ttl?: number; //ms
    },
  ): Promise<{ key: string }> {
    const key = this._constructCacheKey(keyParams);
    await this.cacheManager.store.set<T>(
      this._constructCacheKey(keyParams),
      value,
      options?.ttl,
    );
    return { key };
  }

  async delete(keyParams: CacheParam): Promise<{ key: string }> {
    const key = this._constructCacheKey(keyParams);
    await this.cacheManager.store.del(key);
    return { key };
  }

  private _constructCacheKey(keyParams: CacheParam): string {
    const prefix = this.configService.get('app.appPrefix', { infer: true });
    return util.format(
      `${prefix}-${CacheKey[keyParams.key]}`,
      ...(keyParams.args ?? []),
    );
  }
}
