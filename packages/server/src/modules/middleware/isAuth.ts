import { MiddlewareFn } from "type-graphql";
import { MyContext } from "src/types/MyContext";
import { verify } from "jsonwebtoken";
import { User } from "../../entity/User";
interface decodedJwt {
  device: string;
  id: number;
  iat: Date;
}
export const isAuth: MiddlewareFn<MyContext> = async ({ context: { req }, args }, next) => {
  const {
    headers: { token }
  } = req;
  if (token && typeof token === "string") {
    const { device, id, iat } = verify(token, "justSimpleText") as decodedJwt;
    if (device && id && iat) {
      const foundedUser = await User.findOne({ where: { id } });
      if (foundedUser && foundedUser.devices.includes(device)) {
        args.user = foundedUser;
        return next();
      } else {
        throw new Error("we can't find you!");
      }
    } else {
      throw new Error("your token missing something!");
    }
  } else {
    throw new Error("you must be signed to get data!");
  }
};
