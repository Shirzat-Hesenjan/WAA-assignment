import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  profilePosts,
} from "../controller/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getUsers);
// router.get("/:id", getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", deleteUser);
router.get("/profilePosts", verifyToken, profilePosts);

export default router;
