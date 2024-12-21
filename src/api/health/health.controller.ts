import { ErrorDto } from '@/common/dto/error.dto';
import { GlobalConfig } from '@/config/global-config.type';
import { Public } from '@/decorators/public.decorator';
import { Serialize } from '@/utils/interceptors/serialize';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisOptions, Transport } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { HealthCheckDto } from './dto/health.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private configService: ConfigService<GlobalConfig>,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
  ) {}

  @Public()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: HealthCheckDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorDto,
  })
  @Serialize(HealthCheckDto)
  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    const environment = this.configService.get('app.nodeEnv', { infer: true });

    const list = [
      () => this.db.pingCheck('database', { timeout: 5000 }),
      () =>
        this.microservice.pingCheck<RedisOptions>('redis', {
          transport: Transport.REDIS,
          options: this.configService.getOrThrow('redis'),
        }),
      ...(environment === 'development' || environment === 'local'
        ? [
            () =>
              this.http.pingCheck(
                'api-docs',
                `${this.configService.getOrThrow('app.url', { infer: true })}/api-docs`,
              ),
          ]
        : []),
    ];
    return this.health.check(list);
  }
}
