import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error("Error:", err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({
    error: message,
    status,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
