import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { ErrorDto } from '@/common/dto/error.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth } from '@/decorators/http.decorators';
import { AuthGuard } from '@/guards/auth.guard';
import { Serialize } from '@/utils/interceptors/serialize';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserDto } from './dto/list-user.dto';
import { LoadMoreUsersDto } from './dto/load-more-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiAuth({
    type: UserDto,
    summary: 'Get current user',
  })
  @Get('me')
  async getCurrentUser(@CurrentUser('id') userId: Uuid): Promise<UserDto> {
    return await this.userService.findOne(userId);
  }

  @Post()
  @ApiAuth({
    type: UserDto,
    summary: 'Create user',
    statusCode: HttpStatus.CREATED,
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @ApiAuth({
    type: UserDto,
    summary: 'List users',
    isPaginated: true,
  })
  async findAllUsers(
    @Query() reqDto: ListUserDto,
  ): Promise<OffsetPaginatedDto<UserDto>> {
    return await this.userService.findAll(reqDto);
  }

  @Get('/load-more')
  @ApiAuth({
    type: UserDto,
    summary: 'Load more users',
    isPaginated: true,
    paginationType: 'cursor',
  })
  async loadMoreUsers(
    @Query() reqDto: LoadMoreUsersDto,
  ): Promise<CursorPaginatedDto<UserDto>> {
    return await this.userService.loadMoreUsers(reqDto);
  }

  @Get(':id')
  @ApiAuth({ type: UserDto, summary: 'Find user by id' })
  @ApiParam({ name: 'id', type: 'String' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    type: ErrorDto,
  })
  @Serialize(UserDto)
  async findUser(@Param('id', ParseUUIDPipe) id: Uuid): Promise<UserDto> {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiAuth({ type: UserDto, summary: 'Update user' })
  @ApiParam({ name: 'id', type: 'String' })
  updateUser(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() reqDto: UpdateUserDto,
  ) {
    return this.userService.update(id, reqDto);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Delete user',
    errorResponses: [400, 401, 403, 404, 500],
  })
  @ApiParam({ name: 'id', type: 'String' })
  removeUser(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.userService.remove(id);
  }

  @ApiAuth()
  @Post('me/change-password')
  async changePassword() {
    return 'change-password';
  }
}
