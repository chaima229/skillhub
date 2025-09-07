import { Request, Response, NextFunction } from "express";
import { ProjectAssignmentService } from "../service/projectAssignment.service";
import {
  createProjectAssignmentSchema,
  updateProjectAssignmentSchema,
  getProjectAssignmentsQuerySchema,
  projectAssignmentIdsParamSchema,
} from "../dto/projectAssignment.dto";

const projectAssignmentService = new ProjectAssignmentService();

export async function getProjectAssignments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = getProjectAssignmentsQuerySchema.parse(req.query);
    const result = await projectAssignmentService.getProjectAssignments(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getProjectAssignmentByIds(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { projectId, userId } = projectAssignmentIdsParamSchema.parse(req.params);
    const projectAssignment = await projectAssignmentService.getProjectAssignmentByIds(projectId, userId);
    res.json(projectAssignment);
  } catch (error) {
    next(error);
  }
}

export async function createProjectAssignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createProjectAssignmentSchema.parse(req.body);
    const projectAssignment = await projectAssignmentService.createProjectAssignment(data);
    res.status(201).json(projectAssignment);
  } catch (error) {
    next(error);
  }
}

export async function updateProjectAssignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { projectId, userId } = projectAssignmentIdsParamSchema.parse(req.params);
    const data = updateProjectAssignmentSchema.parse(req.body);
    const projectAssignment = await projectAssignmentService.updateProjectAssignment(projectId, userId, data);
    res.json(projectAssignment);
  } catch (error) {
    next(error);
  }
}

export async function deleteProjectAssignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { projectId, userId } = projectAssignmentIdsParamSchema.parse(req.params);
    await projectAssignmentService.deleteProjectAssignment(projectId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
