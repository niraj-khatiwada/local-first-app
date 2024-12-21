import { AuthModule } from '@/api/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '../cache/cache.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [CacheModule, AuthModule],
  providers: [SocketGateway, ConfigService, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
