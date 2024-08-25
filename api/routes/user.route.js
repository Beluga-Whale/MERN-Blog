import express from "express";
import { updateUser, signout } from "../controllers/user.controller.js";
import { veifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", veifyToken, updateUser);
router.post("/signout", signout);

export default router;
