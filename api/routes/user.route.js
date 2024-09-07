import express from "express";
import {
  updateUser,
  signout,
  getUsers,
  deleteUser,
  getUser,
} from "../controllers/user.controller.js";
import { veifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", veifyToken, updateUser);
router.post("/signout", signout);
router.get("/getusers", veifyToken, getUsers);
router.delete("/deleteuser/:userId", veifyToken, deleteUser);
router.get("/:userId", getUser);
export default router;
