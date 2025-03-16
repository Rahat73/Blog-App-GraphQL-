import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { jwtHelpers } from "./utiliy/jwt-helpers";
import { JwtPayload } from "jsonwebtoken";

export interface IContext {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  userInfo:
    | {
        userId: string;
      }
    | string
    | JwtPayload
    | null;
}

const prisma = new PrismaClient();

const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }): Promise<IContext> => {
      const userInfo = jwtHelpers.getUserInfo(
        req.headers.authorization as string
      );
      console.log(userInfo);
      return {
        prisma,
        userInfo,
      };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main();
