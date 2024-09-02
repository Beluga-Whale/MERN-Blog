import express from "express";
import { veifyToken } from "../utils/verifyUser.js";
import {
  create,
  getPosts,
  deletepost,
  updatepost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", veifyToken, create);
router.get("/getposts", getPosts);
router.delete("/deletepost/:postId/:userId", veifyToken, deletepost);
router.put("/updatepost/:postId/:userId", veifyToken, updatepost);

export default router;
