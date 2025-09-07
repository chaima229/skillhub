import { Request, Response, NextFunction } from "express";
import { EvaluationCriteriaService } from "../service/evaluationCriteria.service";
import {
  createEvaluationCriteriaSchema,
  updateEvaluationCriteriaSchema,
  getEvaluationCriteriaQuerySchema,
  evaluationCriteriaIdParamSchema,
} from "../dto/evaluationCriteria.dto";

const evaluationCriteriaService = new EvaluationCriteriaService();

export async function getEvaluationCriteria(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = getEvaluationCriteriaQuerySchema.parse(req.query);
    const result = await evaluationCriteriaService.getEvaluationCriteria(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getEvaluationCriteriaById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = evaluationCriteriaIdParamSchema.parse(req.params);
    const evaluationCriteria = await evaluationCriteriaService.getEvaluationCriteriaById(id);
    res.json(evaluationCriteria);
  } catch (error) {
    next(error);
  }
}

export async function createEvaluationCriteria(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createEvaluationCriteriaSchema.parse(req.body);
    const evaluationCriteria = await evaluationCriteriaService.createEvaluationCriteria(data);
    res.status(201).json(evaluationCriteria);
  } catch (error) {
    next(error);
  }
}

export async function updateEvaluationCriteria(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = evaluationCriteriaIdParamSchema.parse(req.params);
    const data = updateEvaluationCriteriaSchema.parse(req.body);
    const evaluationCriteria = await evaluationCriteriaService.updateEvaluationCriteria(id, data);
    res.json(evaluationCriteria);
  } catch (error) {
    next(error);
  }
}

export async function deleteEvaluationCriteria(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = evaluationCriteriaIdParamSchema.parse(req.params);
    await evaluationCriteriaService.deleteEvaluationCriteria(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
