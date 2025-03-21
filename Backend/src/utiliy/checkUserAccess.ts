export const checkUserAccess = async (
  prisma: any,
  userId: number,
  postId: number
) => {
  const user = prisma.user.findFirst({
    where: { id: userId },
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

  if (!postToUpdate) {
    return {
      userError: "Post not found",
      post: null,
    };
  }

  if (userId !== postToUpdate.authorId) {
    return {
      userError: "You are not authorized to update this post",
      post: null,
    };
  }
};
