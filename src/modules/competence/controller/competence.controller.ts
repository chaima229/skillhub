import { Request, Response, NextFunction } from "express";
import { CompetenceService } from "../service/competence.service";
import {
  createCompetenceSchema,
  updateCompetenceSchema,
  getCompetencesQuerySchema,
  competenceIdParamSchema,
} from "../dto/competence.dto";

const competenceService = new CompetenceService();

export async function getCompetences(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = getCompetencesQuerySchema.parse(req.query);
    const result = await competenceService.getCompetences(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getCompetenceById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = competenceIdParamSchema.parse(req.params);
    const competence = await competenceService.getCompetenceById(id);
    res.json(competence);
  } catch (error) {
    next(error);
  }
}

export async function createCompetence(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createCompetenceSchema.parse(req.body);
    const competence = await competenceService.createCompetence(data);
    res.status(201).json(competence);
  } catch (error) {
    next(error);
  }
}

export async function updateCompetence(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = competenceIdParamSchema.parse(req.params);
    const data = updateCompetenceSchema.parse(req.body);
    const competence = await competenceService.updateCompetence(id, data);
    res.json(competence);
  } catch (error) {
    next(error);
  }
}

export async function deleteCompetence(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = competenceIdParamSchema.parse(req.params);
    await competenceService.deleteCompetence(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
