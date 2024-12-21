import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateUserInput } from './schema/create-user.schema';
import { GetUserArgs } from './schema/get-user.schema';
import { UserSchema } from './schema/user.schema';
import { UserService } from './user.service';

@Resolver(() => UserSchema)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserSchema])
  async getUsers() {
    return this.userService.getAll();
  }

  @Query(() => UserSchema)
  async getUser(@Args() { id }: GetUserArgs) {
    return this.userService.findOne(id);
  }

  @Mutation(() => UserSchema)
  async createUser(@Args('input') userInput: CreateUserInput) {
    return this.userService.create(userInput);
  }

  @ResolveField(() => UserSchema)
  async self(@Parent() user: UserSchema) {
    return this.userService.findOne(user.id);
  }
}
