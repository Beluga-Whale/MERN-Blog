import express from "express";
import {
  updateUser,
  signout,
  getUsers,
  deleteUser,
} from "../controllers/user.controller.js";
import { veifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", veifyToken, updateUser);
router.post("/signout", signout);
router.get("/getusers", veifyToken, getUsers);
router.delete("/deleteuser/:userId", veifyToken, deleteUser);
export default router;
