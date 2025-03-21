export const Query = {
  me: async (parent: any, args: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return null;
    }
    return await prisma.user.findUnique({
      where: { id: userInfo.userId },
    });
  },
  users: async (parent: any, args: any, { prisma }: any) => {
    return await prisma.user.findMany();
  },
  posts: async (parent: any, args: any, { prisma }: any) => {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  },
  profile: async (parent: any, { userId }: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return null;
    }
    return await prisma.profile.findUnique({
      where: { userId: Number(userId) },
    });
  },
};
