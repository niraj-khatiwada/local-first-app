import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketService {
  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly cacheService: CacheService,
  ) {}

  async sendTo(userId: string, event: string, data?: any) {
    const userClients = await this.cacheService.get<string[]>({
      key: 'USER_SOCKET_CLIENTS',
      args: [userId],
    });
    if (userClients && Array.isArray(userClients)) {
      for (const clientId of userClients) {
        const client = this.socketGateway.getClient(clientId);
        if (client) {
          client.send(
            JSON.stringify({
              event,
              data,
            }),
          );
        }
      }
    }
  }

  async sendToAll(event: string, data: any) {
    const allClients = this.socketGateway.getAllClients();
    for (const client of allClients.values()) {
      client.send(
        JSON.stringify({
          event,
          data,
        }),
      );
    }
  }
}
