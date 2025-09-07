import { EvaluationCriteria, Prisma } from "@prisma/client";
import prisma from "../../../config/prisma";
import {
  CreateEvaluationCriteriaDto,
  UpdateEvaluationCriteriaDto,
  GetEvaluationCriteriaQueryDto,
} from "../dto/evaluationCriteria.dto";

export class EvaluationCriteriaRepository {
  async create(data: CreateEvaluationCriteriaDto): Promise<EvaluationCriteria> {
    return prisma.evaluationCriteria.create({ data });
  }

  async findById(id: string): Promise<EvaluationCriteria | null> {
    return prisma.evaluationCriteria.findUnique({ where: { id } });
  }

  async findMany(query: GetEvaluationCriteriaQueryDto): Promise<{
    evaluationCriteria: EvaluationCriteria[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.EvaluationCriteriaWhereInput = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.projectId) {
      where.projectId = query.projectId;
    }

    const [evaluationCriteria, total] = await Promise.all([
      prisma.evaluationCriteria.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.evaluationCriteria.count({ where }),
    ]);

    return {
      evaluationCriteria,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: UpdateEvaluationCriteriaDto): Promise<EvaluationCriteria> {
    return prisma.evaluationCriteria.update({ where: { id }, data });
  }

  async delete(id: string): Promise<EvaluationCriteria> {
    return prisma.evaluationCriteria.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const evaluationCriteria = await prisma.evaluationCriteria.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!evaluationCriteria;
  }
}
