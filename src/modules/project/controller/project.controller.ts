import { Request, Response, NextFunction } from "express";
import { ProjectService } from "../service/project.service";
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectsQuerySchema,
  projectIdParamSchema,
} from "../dto/project.dto";

const projectService = new ProjectService();

export async function getProjects(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = getProjectsQuerySchema.parse(req.query);
    const result = await projectService.getProjects(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getProjectById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = projectIdParamSchema.parse(req.params);
    const project = await projectService.getProjectById(id);
    res.json(project);
  } catch (error) {
    next(error);
  }
}

export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createProjectSchema.parse(req.body);
    const project = await projectService.createProject(data);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
}

export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = projectIdParamSchema.parse(req.params);
    const data = updateProjectSchema.parse(req.body);
    const project = await projectService.updateProject(id, data);
    res.json(project);
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = projectIdParamSchema.parse(req.params);
    await projectService.deleteProject(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
