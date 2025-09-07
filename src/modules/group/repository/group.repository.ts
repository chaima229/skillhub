import { Group, Prisma } from "@prisma/client";
import prisma from "../../../config/prisma";
import {
  CreateGroupDto,
  UpdateGroupDto,
  GetGroupsQueryDto,
} from "../dto/group.dto";

export class GroupRepository {
  async create(data: CreateGroupDto): Promise<Group> {
    return prisma.group.create({ data });
  }

  async findById(id: string): Promise<Group | null> {
    return prisma.group.findUnique({ where: { id } });
  }

  async findMany(query: GetGroupsQueryDto): Promise<{
    groups: Group[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.GroupWhereInput = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.promotionId) {
      where.promotionId = query.promotionId;
    }

    const [groups, total] = await Promise.all([
      prisma.group.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.group.count({ where }),
    ]);

    return {
      groups,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: UpdateGroupDto): Promise<Group> {
    return prisma.group.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Group> {
    return prisma.group.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const group = await prisma.group.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!group;
  }
}
