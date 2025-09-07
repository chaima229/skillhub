import { Router } from "express";
import {
  getEvaluationCriteria,
  getEvaluationCriteriaById,
  createEvaluationCriteria,
  updateEvaluationCriteria,
  deleteEvaluationCriteria,
} from "../controller/evaluationCriteria.controller";

const router = Router();

router.get("/", getEvaluationCriteria);
router.get("/:id", getEvaluationCriteriaById);
router.post("/", createEvaluationCriteria);
router.patch("/:id", updateEvaluationCriteria);
router.delete("/:id", deleteEvaluationCriteria);

export default router;
