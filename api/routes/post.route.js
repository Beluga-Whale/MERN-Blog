import express from "express";
import { veifyToken } from "../utils/verifyUser.js";
import {
  create,
  getPosts,
  deletepost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", veifyToken, create);
router.get("/getposts", getPosts);
router.delete("/deletepost/:postid/:userId", veifyToken, deletepost);

export default router;
