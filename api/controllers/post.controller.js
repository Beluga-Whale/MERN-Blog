import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";

export const create = async (req, res, next) => {
  // NOTE - เช็คว่าเป็น admin ไหมจาก cookie
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }

  //   NOTE - เช็ค title กับ content ว่ามีไหม
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  //   NOTE - สร้าง slug จาก title อะไรที่ไม่ใช่ตัวอักษรภาษาอังกฤษกับตัวเลข จะถูกแทนที่ด้วย -
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};
