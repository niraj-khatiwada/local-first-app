import {
  ClassField,
  EnumField,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';
import { Role } from '../user.enum';

@Exclude()
export class UserDto {
  @StringField()
  @Expose()
  id: string;

  @EnumField(() => Role)
  @Expose()
  role: Role;

  @StringField()
  @Expose()
  username: string;

  @StringField()
  @Expose()
  email: string;

  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;

  @Expose()
  @StringFieldOptional()
  bio?: string;
}
