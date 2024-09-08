import express from "express";
import {
  createComment,
  getPostComment,
  likeComment,
  editComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { veifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", veifyToken, createComment);
router.get("/getPostComments/:postId", getPostComment);
router.put("/likeComment/:commentId", veifyToken, likeComment);
router.put("/editComment/:commentId", veifyToken, editComment);
router.delete("/deleteComment/:commentId", veifyToken, deleteComment);

export default router;
