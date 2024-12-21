import {
  EmailField,
  PasswordField,
  StringFieldOptional,
  UsernameField,
} from '@/decorators/field.decorators';

export class CreateUserDto {
  @UsernameField()
  username: string;

  @EmailField()
  email: string;

  @PasswordField()
  password: string;

  @StringFieldOptional()
  bio?: string;
}
