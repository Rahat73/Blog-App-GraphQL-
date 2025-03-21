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

    const user = prisma.user.findFirst({
      where: { id: userInfo.userId },
    });

    if (!user) {
      return {
        userError: "User not found",
        post: null,
      };
    }

    const postToUpdate = await prisma.post.findFirst({
      where: { id: Number(postId) },
    });

    if (!post) {
      return {
        userError: "Post not found",
        post: null,
      };
    }

    if (userInfo.userId !== postToUpdate.authorId) {
      return {
        userError: "You are not authorized to update this post",
        post: null,
      };
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(postId) },
      data: post,
    });
    return {
      userError: null,
      post: updatedPost,
    };
  },
};
