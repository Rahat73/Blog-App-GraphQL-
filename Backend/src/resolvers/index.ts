import { Mutation } from "./mutation/mutation";
import { Query } from "./query/query";

export interface IUserInfo {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export const resolvers = {
  Query,
  Mutation,
};
