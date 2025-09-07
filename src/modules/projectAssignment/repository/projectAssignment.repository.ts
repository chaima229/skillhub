import { ProjectAssignment, Prisma } from "@prisma/client";
import prisma from "../../../config/prisma";
import {
  CreateProjectAssignmentDto,
  UpdateProjectAssignmentDto,
  GetProjectAssignmentsQueryDto,
} from "../dto/projectAssignment.dto";

export class ProjectAssignmentRepository {
  async create(data: CreateProjectAssignmentDto): Promise<ProjectAssignment> {
    return prisma.projectAssignment.create({ data });
  }

  async findByIds(projectId: string, userId: string): Promise<ProjectAssignment | null> {
    return prisma.projectAssignment.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
  }

  async findMany(query: GetProjectAssignmentsQueryDto): Promise<{
    projectAssignments: ProjectAssignment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectAssignmentWhereInput = {};
    if (query.searchProjectId) {
      where.projectId = query.searchProjectId;
    }
    if (query.searchUserId) {
      where.userId = query.searchUserId;
    }
    if (query.status) {
      where.status = query.status;
    }

    const [projectAssignments, total] = await Promise.all([
      prisma.projectAssignment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { projectId: "asc" }, // Or another appropriate field for ordering
      }),
      prisma.projectAssignment.count({ where }),
    ]);

    return {
      projectAssignments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(projectId: string, userId: string, data: UpdateProjectAssignmentDto): Promise<ProjectAssignment> {
    return prisma.projectAssignment.update({
      where: { projectId_userId: { projectId, userId } },
      data,
    });
  }

  async delete(projectId: string, userId: string): Promise<ProjectAssignment> {
    return prisma.projectAssignment.delete({
      where: { projectId_userId: { projectId, userId } },
    });
  }

  async exists(projectId: string, userId: string): Promise<boolean> {
    const projectAssignment = await prisma.projectAssignment.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { projectId: true, userId: true },
    });
    return !!projectAssignment;
  }
}
