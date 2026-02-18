import { Router } from "express";
import { handleCreateUser } from "./users.controller.js";

const router = Router();

//users
router.post("/", handleCreateUser);

export default router;
