import { MiddlewareFn } from "type-graphql";

export const logger: MiddlewareFn = async ({ args }, next) => {
  console.log("==================");
  console.log("log from logger after auth", args);
  console.log("==================");

  return next();
};
