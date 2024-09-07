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

export const likeComment = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    // NOTE - เเช็คว่ามี Comment นี้ไหม
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    // NOTE - indexOd ใช้ในการหาว่า req.user.id นี้มีอยู่ใน likes ที่เป็น array ไหม ถ้าไม่มีจะ return -1 ออกมา ถ้ามีฏ้จะ return ตำแหน่ง index ออกมา
    const userIndex = comment.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      // NOTE - เอา user.id ออกเพื่อยกเลิกถูกใจ
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { content } = req.body;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    // NOTE - เช็คว่าเป้นคนเดียวกับที่คอมมเม้นไหม
    if (comment.userId !== req.user.id) {
      return next(errorHandler(403, "You not allowed to edit this comment"));
    }

    const editComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        content,
      },
      { new: true }
    );

    res.status(200).json(editComment);
  } catch (error) {
    next(error);
  }
};
