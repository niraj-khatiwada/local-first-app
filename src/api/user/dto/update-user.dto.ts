import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'username',
  'email',
  'password',
] as const) {}
