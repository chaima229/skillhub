import { Project, Prisma } from "@prisma/client";
import prisma from "../../../config/prisma";
import {
  CreateProjectDto,
  UpdateProjectDto,
  GetProjectsQueryDto,
} from "../dto/project.dto";

export class ProjectRepository {
  async create(data: CreateProjectDto): Promise<Project> {
    return prisma.project.create({ data });
  }

  async findById(id: string): Promise<Project | null> {
    return prisma.project.findUnique({ where: { id } });
  }

  async findMany(query: GetProjectsQueryDto): Promise<{
    projects: Project[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {};
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { objectives: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.createdById) {
      where.createdById = query.createdById;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    return prisma.project.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Project> {
    return prisma.project.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!project;
  }
}
