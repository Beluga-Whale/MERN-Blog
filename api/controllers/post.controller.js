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

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;

    const sortOrder = req.query.order === "asc" ? 1 : -1;

    //NOTE - สร้าง query object สำหรับเงื่อนไขในการค้นหา
    const query = {};
    if (req.query.userId) query.userId = req.query.userId;
    if (req.query.category) query.category = req.query.category;
    if (req.query.slug) query.slug = req.query.slug;
    if (req.query.postId) query._id = req.query.postId;

    if (req.query.searchTerm) {
      query.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    //NOTE - ดึงข้อมูลโพสต์ตาม query ที่สร้างไว้
    const posts = await Post.find(query)
      .sort({ updatedAt: sortOrder })
      .skip(startIndex)
      .limit(limit);

    //NOTE - นับจำนวนโพสต์ทั้งหมดในฐานข้อมูล
    const totalPosts = await Post.countDocuments(query);

    //NOTE - นับจำนวนโพสต์ในช่วงเดือนที่ผ่านมา
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      ...query,
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};
