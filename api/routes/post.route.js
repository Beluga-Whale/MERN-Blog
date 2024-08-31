import express from "express";
import { veifyToken } from "../utils/verifyUser.js";
import { create, getPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", veifyToken, create);
router.get("/getposts", getPosts);

export default router;
