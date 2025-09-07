import { CompetenceOnProject, Prisma } from "@prisma/client";
import prisma from "../../../config/prisma";
import {
  CreateCompetenceOnProjectDto,
  UpdateCompetenceOnProjectDto,
  GetCompetenceOnProjectsQueryDto,
} from "../dto/competenceOnProject.dto";

export class CompetenceOnProjectRepository {
  async create(data: CreateCompetenceOnProjectDto): Promise<CompetenceOnProject> {
    return prisma.competenceOnProject.create({ data });
  }

  async findByIds(projectId: string, competenceId: string): Promise<CompetenceOnProject | null> {
    return prisma.competenceOnProject.findUnique({
      where: { projectId_competenceId: { projectId, competenceId } },
    });
  }

  async findMany(query: GetCompetenceOnProjectsQueryDto): Promise<{
    competenceOnProjects: CompetenceOnProject[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.CompetenceOnProjectWhereInput = {};
    if (query.searchProjectId) {
      where.projectId = query.searchProjectId;
    }
    if (query.searchCompetenceId) {
      where.competenceId = query.searchCompetenceId;
    }

    const [competenceOnProjects, total] = await Promise.all([
      prisma.competenceOnProject.findMany({
        where,
        skip,
        take: limit,
        orderBy: { projectId: "asc" }, // Or another appropriate field for ordering
      }),
      prisma.competenceOnProject.count({ where }),
    ]);

    return {
      competenceOnProjects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(projectId: string, competenceId: string, data: UpdateCompetenceOnProjectDto): Promise<CompetenceOnProject> {
    return prisma.competenceOnProject.update({
      where: { projectId_competenceId: { projectId, competenceId } },
      data,
    });
  }

  async delete(projectId: string, competenceId: string): Promise<CompetenceOnProject> {
    return prisma.competenceOnProject.delete({
      where: { projectId_competenceId: { projectId, competenceId } },
    });
  }

  async exists(projectId: string, competenceId: string): Promise<boolean> {
    const competenceOnProject = await prisma.competenceOnProject.findUnique({
      where: { projectId_competenceId: { projectId, competenceId } },
      select: { projectId: true, competenceId: true },
    });
    return !!competenceOnProject;
  }
}
