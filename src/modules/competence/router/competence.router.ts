import { Router } from "express";
import {
  getCompetences,
  getCompetenceById,
  createCompetence,
  updateCompetence,
  deleteCompetence,
} from "../controller/competence.controller";

const router = Router();

router.get("/", getCompetences);
router.get("/:id", getCompetenceById);
router.post("/", createCompetence);
router.patch("/:id", updateCompetence);
router.delete("/:id", deleteCompetence);

export default router;
