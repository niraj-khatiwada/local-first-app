import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { SyncModule } from './sync/sync.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [HealthModule, AuthModule, UserModule, SyncModule],
})
export class ApiModule {}
