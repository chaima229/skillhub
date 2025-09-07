import { Resource, Prisma } from "@prisma/client";
import prisma from "../../../config/prisma";
import {
  CreateResourceDto,
  UpdateResourceDto,
  GetResourcesQueryDto,
} from "../dto/resource.dto";

export class ResourceRepository {
  async create(data: CreateResourceDto): Promise<Resource> {
    return prisma.resource.create({ data });
  }

  async findById(id: string): Promise<Resource | null> {
    return prisma.resource.findUnique({ where: { id } });
  }

  async findMany(query: GetResourcesQueryDto): Promise<{
    resources: Resource[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.ResourceWhereInput = {};
    if (query.search) {
      where.OR = [
        { type: { contains: query.search, mode: "insensitive" } },
        { url: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.projectId) {
      where.projectId = query.projectId;
    }

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.resource.count({ where }),
    ]);

    return {
      resources,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: UpdateResourceDto): Promise<Resource> {
    return prisma.resource.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Resource> {
    return prisma.resource.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const resource = await prisma.resource.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!resource;
  }
}
