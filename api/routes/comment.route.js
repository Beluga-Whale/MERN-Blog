import express from "express";
import { createComment } from "../controllers/comment.controller.js";
import { veifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", veifyToken, createComment);

export default router;
