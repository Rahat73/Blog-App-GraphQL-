import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const primsa = new PrismaClient();

interface IUserInfo {
  name: string;
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      return await primsa.user.findMany();
    },
  },
  Mutation: {
    signup: async (parent: any, args: IUserInfo, context: any) => {
      const hashedPassword = await bcrypt.hash(args.password, 10);
      const newUser = await primsa.user.create({
        data: { ...args, password: hashedPassword },
      });

      const token = jwt.sign({ userId: newUser.id }, "signature", {
        expiresIn: "1d",
      });

      return {
        authError: null,
        token: token,
      };
    },

    signin: async (parent: any, args: any, context: any) => {
      const user = await primsa.user.findFirst({
        where: { email: args.email },
      });
      if (!user) {
        return {
          authError: "User not found",
          token: null,
        };
      }
      const isPasswordValid = await bcrypt.compare(
        args.password,
        user.password
      );
      if (!isPasswordValid) {
        return {
          authError: "Invalid password",
          token: null,
        };
      }
      const token = jwt.sign({ userId: user.id }, "signature", {
        expiresIn: "1d",
      });
      return {
        authError: null,
        token: token,
      };
    },
  },
};
