import { ArgsType } from "type-graphql";
import { User } from "../entity/User";

@ArgsType()
export class MyArgs {
  user?: User;
}
