import { Router } from "express";
import {
  getProjectAssignments,
  getProjectAssignmentByIds,
  createProjectAssignment,
  updateProjectAssignment,
  deleteProjectAssignment,
} from "../controller/projectAssignment.controller";

const router = Router();

router.get("/", getProjectAssignments);
router.get("/:projectId/:userId", getProjectAssignmentByIds);
router.post("/", createProjectAssignment);
router.patch("/:projectId/:userId", updateProjectAssignment);
router.delete("/:projectId/:userId", deleteProjectAssignment);

export default router;
