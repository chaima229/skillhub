import { Request, Response, NextFunction } from "express";
import { GroupService } from "../service/group.service";
import {
  createGroupSchema,
  updateGroupSchema,
  getGroupsQuerySchema,
  groupIdParamSchema,
} from "../dto/group.dto";

const groupService = new GroupService();

export async function getGroups(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = getGroupsQuerySchema.parse(req.query);
    const result = await groupService.getGroups(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getGroupById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = groupIdParamSchema.parse(req.params);
    const group = await groupService.getGroupById(id);
    res.json(group);
  } catch (error) {
    next(error);
  }
}

export async function createGroup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createGroupSchema.parse(req.body);
    const group = await groupService.createGroup(data);
    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
}

export async function updateGroup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = groupIdParamSchema.parse(req.params);
    const data = updateGroupSchema.parse(req.body);
    const group = await groupService.updateGroup(id, data);
    res.json(group);
  } catch (error) {
    next(error);
  }
}

export async function deleteGroup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = groupIdParamSchema.parse(req.params);
    await groupService.deleteGroup(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
