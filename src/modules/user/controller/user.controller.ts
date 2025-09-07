import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user.service";
import {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  getUsersQuerySchema,
  userIdParamSchema,
} from "../dto/user.dto";

const userService = new UserService();

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = getUsersQuerySchema.parse(req.query);
    const result = await userService.getUsers(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = userIdParamSchema.parse(req.params);
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await userService.createUser(data);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = userIdParamSchema.parse(req.params);
    const data = updateUserSchema.parse(req.body);
    const user = await userService.updateProfile(id, data);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = userIdParamSchema.parse(req.params);
    const data = changePasswordSchema.parse(req.body);
    await userService.changePassword(id, data);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = userIdParamSchema.parse(req.params);
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
