import { Request, Response, NextFunction } from "express";
import { CompetenceOnProjectService } from "../service/competenceOnProject.service";
import {
  createCompetenceOnProjectSchema,
  updateCompetenceOnProjectSchema,
  getCompetenceOnProjectsQuerySchema,
  competenceOnProjectIdsParamSchema,
} from "../dto/competenceOnProject.dto";

const competenceOnProjectService = new CompetenceOnProjectService();

export async function getCompetenceOnProjects(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = getCompetenceOnProjectsQuerySchema.parse(req.query);
    const result = await competenceOnProjectService.getCompetenceOnProjects(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getCompetenceOnProjectByIds(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { projectId, competenceId } = competenceOnProjectIdsParamSchema.parse(req.params);
    const competenceOnProject = await competenceOnProjectService.getCompetenceOnProjectByIds(projectId, competenceId);
    res.json(competenceOnProject);
  } catch (error) {
    next(error);
  }
}

export async function createCompetenceOnProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createCompetenceOnProjectSchema.parse(req.body);
    const competenceOnProject = await competenceOnProjectService.createCompetenceOnProject(data);
    res.status(201).json(competenceOnProject);
  } catch (error) {
    next(error);
  }
}

export async function updateCompetenceOnProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { projectId, competenceId } = competenceOnProjectIdsParamSchema.parse(req.params);
    const data = updateCompetenceOnProjectSchema.parse(req.body);
    const competenceOnProject = await competenceOnProjectService.updateCompetenceOnProject(projectId, competenceId, data);
    res.json(competenceOnProject);
  } catch (error) {
    next(error);
  }
}

export async function deleteCompetenceOnProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { projectId, competenceId } = competenceOnProjectIdsParamSchema.parse(req.params);
    await competenceOnProjectService.deleteCompetenceOnProject(projectId, competenceId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
