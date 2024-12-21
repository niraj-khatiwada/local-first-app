import {
  EmailField,
  PasswordField,
  UsernameField,
} from '@/decorators/field.decorators';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  @UsernameField()
  username: string;

  @Field()
  @EmailField()
  email: string;

  @Field()
  @PasswordField()
  password: string;
}
