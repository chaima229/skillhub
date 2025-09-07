import { Router } from "express";
import {
  getCompetenceOnProjects,
  getCompetenceOnProjectByIds,
  createCompetenceOnProject,
  updateCompetenceOnProject,
  deleteCompetenceOnProject,
} from "../controller/competenceOnProject.controller";

const router = Router();

router.get("/", getCompetenceOnProjects);
router.get("/:projectId/:competenceId", getCompetenceOnProjectByIds);
router.post("/", createCompetenceOnProject);
router.patch("/:projectId/:competenceId", updateCompetenceOnProject);
router.delete("/:projectId/:competenceId", deleteCompetenceOnProject);

export default router;
