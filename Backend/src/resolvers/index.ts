import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import config from "../config";
import { jwtHelpers } from "../utiliy/jwt-helpers";

const primsa = new PrismaClient();

interface IUserInfo {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      return await primsa.user.findMany();
    },
  },
  Mutation: {
    signup: async (parent: any, args: IUserInfo, context: any) => {
      const isUserExists = await primsa.user.findFirst({
        where: { email: args.email },
      });

      if (isUserExists) {
        return {
          authError: "User already exists",
          token: null,
        };
      }

      const hashedPassword = await bcrypt.hash(args.password, 10);
      const newUser = await primsa.user.create({
        data: { name: args.name, email: args.email, password: hashedPassword },
      });

      const token = jwtHelpers.generateToken(
        { id: newUser.id },
        config.jwt.JWT_SECRET as Secret
      );

      const profile = await primsa.profile.create({
        data: { bio: args.bio || "", userId: newUser.id },
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
      const token = jwtHelpers.generateToken(
        { id: user.id },
        config.jwt.JWT_SECRET as Secret
      );
      return {
        authError: null,
        token: token,
      };
    },
  },
};
