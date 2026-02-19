import { Router } from "express";
import {
  handleCreateUser,
  handlelistUsers,
  handleGetUserById,
  handlDeleteUser,
  handleUpdateUser,
  handleSearchUserByEmail,
  handleCountUsers,
  handleUpdatePassword,
  handleCreateManyUsers,
} from "./users.controller.js";

const router = Router();

router.get("/count", handleCountUsers);
router.get("/search", handleSearchUserByEmail);
router.post("/bulk", handleCreateManyUsers);
router.patch("/:id/password", handleUpdatePassword);
router.post("/", handleCreateUser);
router.get("/", handlelistUsers);
router.get("/:id", handleGetUserById);
router.delete("/:id", handlDeleteUser);
router.patch("/:id", handleUpdateUser);

export default router;
