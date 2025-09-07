import { Router } from "express";
import {
  getSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
} from "../controller/submission.controller";

const router = Router();

router.get("/", getSubmissions);
router.get("/:id", getSubmissionById);
router.post("/", createSubmission);
router.patch("/:id", updateSubmission);
router.delete("/:id", deleteSubmission);

export default router;
