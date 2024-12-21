import { IVerifyEmailJob } from '@/common/interfaces/job.interface';
import { Branded } from '@/common/types/types';
import { GlobalConfig } from '@/config/global-config.type';
import { JobName, QueueName } from '@/constants/job.constant';
import { I18nTranslations } from '@/generated/i18n.generated';
import { CacheService } from '@/shared/cache/cache.service';
import { verifyPassword } from '@/utils/password/password.util';
import { InjectQueue } from '@nestjs/bullmq';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { plainToInstance } from 'class-transformer';
import crypto from 'crypto';
import ms from 'ms';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Role } from '../user/user.enum';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { JwtPayloadType } from './types/jwt-payload.type';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';

type Token = Branded<
  {
    accessToken: string;
    refreshToken: string;
    tokenTTL: number;
  },
  'token'
>;

@Injectable()
export class AuthService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly configService: ConfigService<GlobalConfig>,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectQueue(QueueName.EMAIL)
    private readonly emailQueue: Queue<IVerifyEmailJob, any, string>,
    private readonly cacheService: CacheService,
  ) {}

  async login(dto: LoginReqDto): Promise<LoginResDto> {
    const { email, password } = dto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    const isPasswordValid =
      user && (await verifyPassword(password, user.password));

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const { hash } = await this._generateAuthHash(user?.id);

    const token = await this._createAuthTokens({
      id: user.id,
      hash,
      role: user?.role,
    });

    return plainToInstance(LoginResDto, {
      userId: user.id,
      ...token,
    });
  }

  async register(dto: RegisterReqDto): Promise<RegisterResDto> {
    const userExists = await this.userRepository.exists({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new ConflictException(
        this.i18nService.t('user.sameUsernameOrEmailAlreadyExists'),
      );
    }

    const user = this.userRepository.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });

    await user.save({ transaction: false });

    const token = await this._createEmailVerificationToken(user?.id);

    await this.emailQueue.add(JobName.EMAIL_VERIFICATION, {
      email: dto.email,
      token,
    });

    return plainToInstance(RegisterResDto, {
      userId: user.id,
    });
  }

  async refreshToken(dto: RefreshReqDto): Promise<RefreshResDto> {
    let payload: JwtRefreshPayloadType;
    try {
      payload = await this.verifyRefreshToken(dto.refreshToken);
    } catch {
      throw new UnauthorizedException();
    }
    const { hash, id: userId } = payload;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id'],
    });
    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.notFound'));
    }

    const { hash: newHash } = await this._generateAuthHash(userId);

    const tokens = await this._createAuthTokens({
      id: user.id,
      hash: newHash,
      role: user?.role,
    });
    await this.cacheService.delete({ key: 'ACCESS_TOKEN', args: [hash] });
    return tokens;
  }

  async verifyAccessToken(token: string): Promise<JwtPayloadType> {
    let payload: JwtPayloadType;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      });
    } catch {
      throw new UnauthorizedException();
    }
    const { id, hash } = payload;

    const userId = await this.cacheService.get<string>({
      key: 'ACCESS_TOKEN',
      args: [hash],
    });
    if (!userId || userId !== id) {
      throw new UnauthorizedException();
    }
    return payload;
  }

  async verifyRefreshToken(token: string): Promise<JwtRefreshPayloadType> {
    let payload: JwtRefreshPayloadType;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.refreshSecret', {
          infer: true,
        }),
      });
    } catch {
      throw new UnauthorizedException();
    }
    const { id, hash } = payload;
    const userId = await this.cacheService.get<string>({
      key: 'ACCESS_TOKEN',
      args: [hash],
    });
    if (!userId || userId !== id) {
      throw new UnauthorizedException();
    }
    return payload;
  }

  private async _createEmailVerificationToken(userId: string): Promise<string> {
    const token = await this.jwtService.signAsync(
      {
        id: userId,
      },
      {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.confirmEmailExpiresIn', {
          infer: true,
        }),
      },
    );
    const tokenExpiresIn = this.configService.getOrThrow(
      'auth.confirmEmailExpiresIn',
      {
        infer: true,
      },
    );
    await this.cacheService.set(
      { key: 'EMAIL_VERIFICATION_TOKEN', args: [userId] },
      token,
      { ttl: ms(tokenExpiresIn) },
    );
    return token;
  }

  private async _createAuthTokens(data: {
    id: string;
    hash: string;
    role: Role;
  }): Promise<Token> {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expiresIn', {
      infer: true,
    });
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          hash: data.hash,
          role: data?.role,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          id: data.id,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpiresIn', {
            infer: true,
          }),
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
      tokenTTL: ms(tokenExpiresIn),
    } as Token;
  }

  private async _generateAuthHash(userId: string) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expiresIn', {
      infer: true,
    });
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const ttl = ms(tokenExpiresIn);
    await this.cacheService.set({ key: 'ACCESS_TOKEN', args: [hash] }, userId, {
      ttl: ttl,
    });
    return { hash, ttl: ttl };
  }
}
