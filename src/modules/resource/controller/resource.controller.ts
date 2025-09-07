import { Request, Response, NextFunction } from "express";
import { ResourceService } from "../service/resource.service";
import {
  createResourceSchema,
  updateResourceSchema,
  getResourcesQuerySchema,
  resourceIdParamSchema,
} from "../dto/resource.dto";

const resourceService = new ResourceService();

export async function getResources(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = getResourcesQuerySchema.parse(req.query);
    const result = await resourceService.getResources(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getResourceById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = resourceIdParamSchema.parse(req.params);
    const resource = await resourceService.getResourceById(id);
    res.json(resource);
  } catch (error) {
    next(error);
  }
}

export async function createResource(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createResourceSchema.parse(req.body);
    const resource = await resourceService.createResource(data);
    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
}

export async function updateResource(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = resourceIdParamSchema.parse(req.params);
    const data = updateResourceSchema.parse(req.body);
    const resource = await resourceService.updateResource(id, data);
    res.json(resource);
  } catch (error) {
    next(error);
  }
}

export async function deleteResource(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = resourceIdParamSchema.parse(req.params);
    await resourceService.deleteResource(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
