import { MyArgs } from "../../types/MyArgs";
import { Query, Resolver, UseMiddleware, Args } from "type-graphql";
import { User } from "../../entity/User";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class MeResolver {
  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  me(@Args() { user }: MyArgs): User | undefined {
    return user ? user : undefined;
  }
}
