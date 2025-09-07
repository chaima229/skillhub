import { Request, Response, NextFunction } from "express";
import { SubmissionService } from "../service/submission.service";
import {
  createSubmissionSchema,
  updateSubmissionSchema,
  getSubmissionsQuerySchema,
  submissionIdParamSchema,
} from "../dto/submission.dto";

const submissionService = new SubmissionService();

export async function getSubmissions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = getSubmissionsQuerySchema.parse(req.query);
    const result = await submissionService.getSubmissions(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getSubmissionById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = submissionIdParamSchema.parse(req.params);
    const submission = await submissionService.getSubmissionById(id);
    res.json(submission);
  } catch (error) {
    next(error);
  }
}

export async function createSubmission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createSubmissionSchema.parse(req.body);
    const submission = await submissionService.createSubmission(data);
    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
}

export async function updateSubmission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = submissionIdParamSchema.parse(req.params);
    const data = updateSubmissionSchema.parse(req.body);
    const submission = await submissionService.updateSubmission(id, data);
    res.json(submission);
  } catch (error) {
    next(error);
  }
}

export async function deleteSubmission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = submissionIdParamSchema.parse(req.params);
    await submissionService.deleteSubmission(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
