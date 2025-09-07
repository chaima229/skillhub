import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl } = req;
  logger.info(`[${method}] ${originalUrl}`);
  next();
}
