import { Competence, Prisma } from "@prisma/client";
import prisma from "../../../config/prisma";
import {
  CreateCompetenceDto,
  UpdateCompetenceDto,
  GetCompetencesQueryDto,
} from "../dto/competence.dto";

export class CompetenceRepository {
  async create(data: CreateCompetenceDto): Promise<Competence> {
    return prisma.competence.create({ data });
  }

  async findById(id: string): Promise<Competence | null> {
    return prisma.competence.findUnique({ where: { id } });
  }

  async findMany(query: GetCompetencesQueryDto): Promise<{
    competences: Competence[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.CompetenceWhereInput = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { level: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [competences, total] = await Promise.all([
      prisma.competence.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.competence.count({ where }),
    ]);

    return {
      competences,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: UpdateCompetenceDto): Promise<Competence> {
    return prisma.competence.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Competence> {
    return prisma.competence.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const competence = await prisma.competence.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!competence;
  }
}
