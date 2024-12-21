import { AuthService } from '@/api/auth/auth.service';
import { getConfig as getAppConfig } from '@/config/app.config';
import { AuthGuard } from '@/guards/auth.guard';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import 'dotenv/config';
import ms from 'ms';
import { Server, Socket } from 'socket.io';
import { CacheService } from '../cache/cache.service';

const appConfig = getAppConfig();

@WebSocketGateway(0, { cors: appConfig.corsOrigin })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  readonly logger = new Logger(this.constructor.name);

  @WebSocketServer()
  private server: Server;

  private readonly clients: Map<string, Socket>;

  constructor(
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {
    this.clients = new Map();
  }

  afterInit(): void {
    this.logger.log(`Websocket gateway initialized.`);
    this.server.use(async (socket: Socket, next) => {
      const [type, token] = socket.handshake?.auth?.['token']?.split(' ') ?? [];
      const bearerToken = type === 'Bearer' ? token : undefined;
      try {
        socket['user'] = await this.authService.verifyAccessToken(bearerToken);
        return next();
      } catch (_) {
        return next(new UnauthorizedException());
      }
    });
  }

  async handleConnection(socket: Socket) {
    // console.log('New client connected: ', socket?.id);
    const userId = socket?.['user']?.id as string;
    if (!userId) {
      return;
    }
    this.clients.set(socket?.id, socket);
    const userClients = await this.cacheService.get<string[]>({
      key: 'USER_SOCKET_CLIENTS',
      args: [userId],
    });
    const clients = new Set<string>(Array.from(userClients ?? []));
    clients.add(socket?.id);
    await this.cacheService.set(
      { key: 'USER_SOCKET_CLIENTS', args: [userId] },
      Array.from(clients),
      { ttl: ms('1h') },
    );
  }

  async handleDisconnect(socket: Socket) {
    // console.log('Client disconnected: ', socket?.id);

    this.clients.delete(socket?.id);
    const userId = socket?.['user']?.id as string;
    if (!userId) {
      return;
    }
    const userClients = await this.cacheService.get<string[]>({
      key: 'USER_SOCKET_CLIENTS',
      args: [userId],
    });
    const clients = new Set<string>(Array.from(userClients ?? []));
    if (clients.has(socket?.id)) {
      clients.delete(socket?.id);
      await this.cacheService.set(
        { key: 'USER_SOCKET_CLIENTS', args: [userId] },
        Array.from(clients),
        { ttl: ms('1h') },
      );
    }
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: any,
    @ConnectedSocket() socket: Socket,
  ) {
    // console.log(
    //   `Received message from client: ${socket?.id}`,
    //   JSON.stringify(message, null, 2),
    // );

    socket.send('hello world');
  }

  @SubscribeMessage('ping')
  async handlePing(socket: Socket) {
    socket.send('pong');
  }

  getClient(clientId: string): Socket | undefined {
    return this.clients?.get(clientId);
  }

  getAllClients() {
    return this.clients;
  }
}
