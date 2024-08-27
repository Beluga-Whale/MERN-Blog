import express from "express";
import { veifyToken } from "../utils/verifyUser.js";
import { create } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", veifyToken, create);

export default router;
