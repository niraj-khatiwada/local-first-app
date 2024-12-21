import { CursorPaginationDto } from '@/common/dto/cursor-pagination/cursor-pagination.dto';
import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { I18nTranslations } from '@/generated/i18n.generated';
import { buildPaginator } from '@/utils/pagination/cursor-pagination';
import { paginate } from '@/utils/pagination/offset-pagination';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserDto } from './dto/list-user.dto';
import { LoadMoreUsersDto } from './dto/load-more-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDto> {
    const { username, email, password } = dto;

    // check uniqueness of username/email
    const user = await this.userRepository.findOne({
      where: [
        {
          username,
        },
        {
          email,
        },
      ],
    });

    if (user) {
      throw new ConflictException(
        this.i18nService.t('user.sameUsernameOrEmailAlreadyExists'),
      );
    }

    const newUser = this.userRepository.create({
      username,
      email,
      password,
    });

    return await this.userRepository.save(newUser);
  }

  async findAll(reqDto: ListUserDto): Promise<OffsetPaginatedDto<UserDto>> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC');
    const [users, metaDto] = await paginate<UserEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });
    return new OffsetPaginatedDto(plainToInstance(UserDto, users), metaDto);
  }

  async loadMoreUsers(
    reqDto: LoadMoreUsersDto,
  ): Promise<CursorPaginatedDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const paginator = buildPaginator({
      entity: UserEntity,
      alias: 'user',
      paginationKeys: ['createdAt'],
      query: {
        limit: reqDto.limit,
        order: 'DESC',
        afterCursor: reqDto.afterCursor,
        beforeCursor: reqDto.beforeCursor,
      },
    });

    const { data, cursor } = await paginator.paginate(queryBuilder);

    const metaDto = new CursorPaginationDto(
      data.length,
      cursor.afterCursor,
      cursor.beforeCursor,
      reqDto,
    );

    return new CursorPaginatedDto(plainToInstance(UserDto, data), metaDto);
  }

  async findOne(id: Uuid | string): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.notFound'));
    }
    return user;
  }

  async update(id: Uuid | string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneByOrFail({ id });

    await this.userRepository.save(
      this.userRepository.merge(user, updateUserDto),
    );
  }

  async remove(id: Uuid | string) {
    await this.userRepository.findOneByOrFail({ id });
    await this.userRepository.softDelete(id);
  }

  async getAll(options?: FindManyOptions<UserEntity>) {
    return this.userRepository.find(options);
  }
}
