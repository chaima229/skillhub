import { Submission, Prisma, AssignmentStatus } from "@prisma/client";
import prisma from "../../../config/prisma";
import {
  CreateSubmissionDto,
  UpdateSubmissionDto,
  GetSubmissionsQueryDto,
} from "../dto/submission.dto";

export class SubmissionRepository {
  async create(data: CreateSubmissionDto): Promise<Submission> {
    return prisma.submission.create({ data });
  }

  async findById(id: string): Promise<Submission | null> {
    return prisma.submission.findUnique({ where: { id } });
  }

  async findMany(query: GetSubmissionsQueryDto): Promise<{
    submissions: Submission[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.SubmissionWhereInput = {};
    if (query.search) {
      where.OR = [
        { url: { contains: query.search, mode: "insensitive" } },
        { comments: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.userId) {
      where.userId = query.userId;
    }
    if (query.projectId) {
      where.projectId = query.projectId;
    }
    if (query.status) {
      where.status = query.status;
    }

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.submission.count({ where }),
    ]);

    return {
      submissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: UpdateSubmissionDto): Promise<Submission> {
    return prisma.submission.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Submission> {
    return prisma.submission.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const submission = await prisma.submission.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!submission;
  }
}
