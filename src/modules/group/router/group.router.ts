import { Router } from "express";
import {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controller/group.controller";

const router = Router();

router.get("/", getGroups);
router.get("/:id", getGroupById);
router.post("/", createGroup);
router.patch("/:id", updateGroup);
router.delete("/:id", deleteGroup);

export default router;
