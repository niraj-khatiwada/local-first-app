import { GlobalConfig } from '@/config/global-config.type';
import { CacheService } from '@/shared/cache/cache.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class SyncService {
  constructor(
    private readonly configService: ConfigService<GlobalConfig>,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly cacheService: CacheService,
  ) {}

  createSyncToken(userId: string) {}
}
