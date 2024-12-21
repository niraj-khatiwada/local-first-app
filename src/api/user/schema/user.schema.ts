import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserSchema {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => UserSchema)
  self: UserSchema;
}
