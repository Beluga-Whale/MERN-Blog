import express from "express";
import {
  createComment,
  getPostComment,
} from "../controllers/comment.controller.js";
import { veifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", veifyToken, createComment);
router.get("/getPostComments/:postId", getPostComment);

export default router;
