import * as bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import { IUserInfo } from "..";
import config from "../../config";
import { jwtHelpers } from "../../utiliy/jwt-helpers";

export const Mutation = {
  signup: async (parent: any, args: IUserInfo, { prisma }: any) => {
    const isUserExists = await prisma.user.findFirst({
      where: { email: args.email },
    });

    if (isUserExists) {
      return {
        authError: "User already exists",
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(args.password, 10);
    const newUser = await prisma.user.create({
      data: { name: args.name, email: args.email, password: hashedPassword },
    });

    const token = jwtHelpers.generateToken(
      { id: newUser.id },
      config.jwt.JWT_SECRET as Secret
    );

    const profile = await prisma.profile.create({
      data: { bio: args.bio || "", userId: newUser.id },
    });

    return {
      authError: null,
      token: token,
    };
  },

  signin: async (parent: any, args: any, { prisma }: any) => {
    const user = await prisma.user.findFirst({
      where: { email: args.email },
    });
    if (!user) {
      return {
        authError: "User not found",
        token: null,
      };
    }
    const isPasswordValid = await bcrypt.compare(args.password, user.password);
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

  addPost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        userError: "User not authorized",
        post: null,
      };
    }
    if (!args.title || !args.content) {
      return {
        userError: "Title and content are required",
        post: null,
      };
    }

    const newPost = await prisma.post.create({
      data: {
        title: args.title,
        content: args.content,
        authorId: userInfo.userId,
      },
    });
    return {
      userError: null,
      post: newPost,
    };
  },
};
