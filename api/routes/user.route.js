import express from "express";
import { updateUser } from "../controllers/user.controller.js";
import { veifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", veifyToken, updateUser);

export default router;
