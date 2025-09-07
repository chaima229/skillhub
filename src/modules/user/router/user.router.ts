import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from "../controller/user.controller";

const router = Router();

// Get all users (pagination, recherche)
router.get("/", getUsers);

// Get user by ID
router.get("/:id", getUserById);

// Create new user
router.post("/", createUser);

// Update user by ID (PATCH pour partiel)
router.patch("/:id", updateUser);

// Change password
router.patch("/:id/change-password", changePassword);

// Delete user by ID
router.delete("/:id", deleteUser);

export default router;
