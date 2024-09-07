import Comment from "../models/comment.model.js ";
import { errorHandler } from "../utils/error.js";

// NOTE - สร้าง Comment
export const createComment = async (req, res, next) => {
  const { content, postId, userId } = req.body;

  try {
    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to created this comment")
      );
    }

    const newComment = await Comment.create({
      content,
      postId,
      userId,
    });

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComment = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const comment = await Comment.find({ postId: postId }).sort({
      createdAt: -1,
    });

    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
