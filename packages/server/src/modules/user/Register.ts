import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../../entity/User";
import { isAuth } from "../middleware/isAuth";
import { LoginInput, AcceptCodeInp } from "./register/RegisterInput";
import { logger } from "../middleware/logger";
import { sendPattern } from "../../services/SendSMS";
import { includes } from "lodash";
import { LoginResponse, AcceptCodeResponse } from "./register/LoginResponse";
import { sign } from "jsonwebtoken";
import { parseInt } from "lodash";

const timeOutTime = 100500;
@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth, logger)
  @Query(() => String)
  async hello() {
    return await "hello word";
  }

  @Mutation(() => LoginResponse)
  async loginWithPhone(@Arg("data") { phone, device }: LoginInput): Promise<LoginResponse> {
    const code = Math.floor(Math.random() * (9999 - 1000) + 1000);

    let response = {} as LoginResponse;

    if (process.env.NODE_ENV === "development") {
      response.code = code;
    }

    const resetAuthCode = async (user: User, number: number): Promise<User> => {
      // TODO must be have table to insert userid and time to that for multiple sync user login so in that table we can check if code sended to user or not to send again code, this table has several benefits like check how many time user asked for code and sended back wrong, ... ==================

      return setTimeout(async (): Promise<User> => {
        user.authCode = 0;
        return await user.save();
      }, number) as any;
    };

    const foundedUser = await User.findOne({ where: { phone } });
    if (foundedUser) {
      foundedUser.authCode = code;
      if (!includes(foundedUser.devices, device)) {
        foundedUser.devices.push(device);
      }
      await foundedUser.save();
      response.user = foundedUser;
      resetAuthCode(foundedUser, timeOutTime);
    } else {
      const user = await User.create({
        authCode: code,
        phone,
        devices: [device]
      }).save();
      response.user = user;
      resetAuthCode(user, timeOutTime);
    }

    if (process.env.NODE_ENV === "production") {
      sendPattern({ phone, code });
    }

    return response;
  }

  @Mutation(() => AcceptCodeResponse)
  async acceptCode(@Arg("data") { phone, device, code }: AcceptCodeInp): Promise<AcceptCodeResponse> {
    const foundedUser = await User.findOne({ where: { phone } });

    if (parseInt(`${code}`) === 0) {
      throw new Error("your code is completely wrong");
    }
    if (foundedUser && foundedUser.authCode === code && foundedUser.devices.includes(device)) {
      foundedUser.authCode = 0;
      foundedUser.save();
      return {
        token: sign({ id: foundedUser.id, device, iat: new Date().getTime() }, "justSimpleText"),
        user: foundedUser
      };
    } else {
      throw new Error("can't be send code");
    }
  }
}
