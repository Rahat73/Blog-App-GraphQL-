import { checkUserAccess } from "../../utiliy/checkUserAccess";

export const postResolvers = {
  addPost: async (parent: any, { post }: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        userError: "User not authorized",
        post: null,
      };
    }
    if (!post.title || !post.content) {
      return {
        userError: "Title and content are required",
        post: null,
      };
    }

    const newPost = await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: userInfo.userId,
      },
    });
    return {
      userError: null,
      post: newPost,
    };
  },

  updatePost: async (
    parent: any,
    { postId, post }: any,
    { prisma, userInfo }: any
  ) => {
    if (!userInfo) {
      return {
        userError: "User not authorized",
        post: null,
      };
    }

    const error = await checkUserAccess(prisma, userInfo.userId, postId);

    const updatedPost = await prisma.post.update({
      where: { id: Number(postId) },
      data: post,
    });
    return {
      userError: null,
      post: updatedPost,
    };
  },

  deletePost: async (
    parent: any,
    { postId }: any,
    { prisma, userInfo }: any
  ) => {
    if (!userInfo) {
      return {
        userError: "User not authorized",
        post: null,
      };
    }

    const error = await checkUserAccess(
      prisma,
      userInfo.userId,
      Number(postId)
    );

    console.log(error);

    if (error) {
      return error;
    }

    const deletedPost = await prisma.post.delete({
      where: { id: Number(postId) },
    });

    return {
      userError: null,
      post: deletedPost,
    };
  },
};
