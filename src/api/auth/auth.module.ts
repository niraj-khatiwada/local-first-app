import { QueueName } from '@/constants/job.constant';
import { CacheModule } from '@/shared/cache/cache.module';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({}),
    BullModule.registerQueue({
      name: QueueName.EMAIL,
    }),
    BullBoardModule.forFeature({
      name: QueueName.EMAIL,
      adapter: BullMQAdapter,
    }),
    CacheModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
