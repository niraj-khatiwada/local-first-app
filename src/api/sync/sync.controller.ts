import { CurrentUser } from '@/decorators/current-user.decorator';
import { AuthGuard } from '@/guards/auth.guard';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SyncService } from './sync.service';

@ApiTags('sync')
@UseGuards(AuthGuard)
@Controller({
  path: 'sync',
  version: '1',
})
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('/token')
  getToken(@CurrentUser('id') userId: string) {
    return this.syncService.createSyncToken(userId);
  }
}
