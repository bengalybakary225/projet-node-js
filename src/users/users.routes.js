import { Router } from "express";
import {
  handleCreateUser,
  handlelistUsers,
  handleGetUserById,
  handlDeleteUser,
  handleUpdateUser,
} from "./users.controller.js";

const router = Router();

//users
router.post("/", handleCreateUser); //create

router.get("/", handlelistUsers); //afficher

router.get("/:id", handleGetUserById); //afficher un utulisateur avec l'id

router.delete("/:id", handlDeleteUser); //suprimmer un utulisateur

router.patch("/:id", handleUpdateUser); // modifier

export default router;
