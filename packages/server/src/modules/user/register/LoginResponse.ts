import { Field, ObjectType, Int } from "type-graphql";
import { User } from "../../../entity/User";

@ObjectType()
export class LoginResponse {
  @Field(() => Int, { nullable: true })
  code?: number;

  @Field()
  user: User;
}

@ObjectType()
export class AcceptCodeResponse {
  @Field()
  token: string;

  @Field()
  user: User;
}
