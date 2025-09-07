import { Submission } from "@prisma/client";
import { SubmissionRepository } from "../repository/submission.repository";
import {
  CreateSubmissionDto,
  UpdateSubmissionDto,
  GetSubmissionsQueryDto,
  SubmissionResponseDto,
} from "../dto/submission.dto";
import {
  NotFoundError,
  ConflictError,
} from "../../../utils/error-handler";

export class SubmissionService {
  private submissionRepository: SubmissionRepository;

  constructor() {
    this.submissionRepository = new SubmissionRepository();
  }

  async createSubmission(data: CreateSubmissionDto): Promise<SubmissionResponseDto> {
    // Check if a submission for this user and project already exists
    const existingSubmission = await this.submissionRepository.findMany({
      userId: data.userId,
      projectId: data.projectId,
      limit: 1,
    });
    if (existingSubmission.total > 0) {
      throw new ConflictError("Submission for this user and project already exists");
    }

    const submission = await this.submissionRepository.create(data);
    return this.mapToResponseDto(submission);
  }

  async getSubmissions(query: GetSubmissionsQueryDto): Promise<{
    submissions: SubmissionResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.submissionRepository.findMany(query);
    return {
      submissions: result.submissions.map((s) => this.mapToResponseDto(s)),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getSubmissionById(id: string): Promise<SubmissionResponseDto> {
    const submission = await this.submissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundError("Submission not found");
    }
    return this.mapToResponseDto(submission);
  }

  async updateSubmission(
    id: string,
    updateData: UpdateSubmissionDto
  ): Promise<SubmissionResponseDto> {
    const existingSubmission = await this.submissionRepository.findById(id);
    if (!existingSubmission) {
      throw new NotFoundError("Submission not found");
    }

    const updatedSubmission = await this.submissionRepository.update(id, updateData);
    return this.mapToResponseDto(updatedSubmission);
  }

  async deleteSubmission(id: string): Promise<void> {
    const submission = await this.submissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundError("Submission not found");
    }
    await this.submissionRepository.delete(id);
  }

  private mapToResponseDto(submission: Submission): SubmissionResponseDto {
    return {
      id: submission.id,
      userId: submission.userId,
      projectId: submission.projectId,
      url: submission.url || undefined,
      comments: submission.comments || undefined,
      grade: submission.grade || undefined,
      status: submission.status,
      createdAt: submission.createdAt.toISOString(),
      updatedAt: submission.updatedAt.toISOString(),
    };
  }
}
