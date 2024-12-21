import { Uuid } from '@/common/types/common.type';
import { UUIDField } from '@/decorators/field.decorators';
import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class GetUserArgs {
  @Field(() => ID)
  @UUIDField()
  id: Uuid;
}
