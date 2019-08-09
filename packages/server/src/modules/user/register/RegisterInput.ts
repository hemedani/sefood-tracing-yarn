import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class LoginInput {
  @Field()
  // @IsPhoneNumber("ZZ")
  phone: number;

  @Field()
  @Length(2, 255)
  device: string;
}

@InputType()
export class AcceptCodeInp {
  @Field()
  // @IsPhoneNumber("ZZ")
  phone: number;

  @Field()
  @Length(2, 255)
  device: string;

  @Field()
  // @Length(4, 4)
  code: number;
}
