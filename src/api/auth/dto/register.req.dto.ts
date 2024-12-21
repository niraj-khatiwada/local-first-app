import {
  EmailField,
  PasswordField,
  StringField,
} from '@/decorators/field.decorators';

export class RegisterReqDto {
  @StringField()
  username!: string;

  @EmailField()
  email!: string;

  @PasswordField()
  password!: string;
}
