import { ProjectAssignment } from "@prisma/client";
import { ProjectAssignmentRepository } from "../repository/projectAssignment.repository";
import {
  CreateProjectAssignmentDto,
  UpdateProjectAssignmentDto,
  GetProjectAssignmentsQueryDto,
  ProjectAssignmentResponseDto,
} from "../dto/projectAssignment.dto";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../../../utils/error-handler";

export class ProjectAssignmentService {
  private projectAssignmentRepository: ProjectAssignmentRepository;

  constructor() {
    this.projectAssignmentRepository = new ProjectAssignmentRepository();
  }

  async createProjectAssignment(data: CreateProjectAssignmentDto): Promise<ProjectAssignmentResponseDto> {
    const existingAssignment = await this.projectAssignmentRepository.findByIds(data.projectId, data.userId);
    if (existingAssignment) {
      throw new ConflictError("Project already assigned to this user");
    }
    const assignment = await this.projectAssignmentRepository.create(data);
    return this.mapToResponseDto(assignment);
  }

  async getProjectAssignments(query: GetProjectAssignmentsQueryDto): Promise<{
    projectAssignments: ProjectAssignmentResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.projectAssignmentRepository.findMany(query);
    return {
      projectAssignments: result.projectAssignments.map((pa) => this.mapToResponseDto(pa)),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getProjectAssignmentByIds(
    projectId: string,
    userId: string
  ): Promise<ProjectAssignmentResponseDto> {
    const assignment = await this.projectAssignmentRepository.findByIds(projectId, userId);
    if (!assignment) {
      throw new NotFoundError("Project assignment not found");
    }
    return this.mapToResponseDto(assignment);
  }

  async updateProjectAssignment(
    projectId: string,
    userId: string,
    updateData: UpdateProjectAssignmentDto
  ): Promise<ProjectAssignmentResponseDto> {
    const existingAssignment = await this.projectAssignmentRepository.findByIds(projectId, userId);
    if (!existingAssignment) {
      throw new NotFoundError("Project assignment not found");
    }

    const updatedAssignment = await this.projectAssignmentRepository.update(projectId, userId, updateData);
    return this.mapToResponseDto(updatedAssignment);
  }

  async deleteProjectAssignment(
    projectId: string,
    userId: string
  ): Promise<void> {
    const assignment = await this.projectAssignmentRepository.findByIds(projectId, userId);
    if (!assignment) {
      throw new NotFoundError("Project assignment not found");
    }
    await this.projectAssignmentRepository.delete(projectId, userId);
  }

  private mapToResponseDto(assignment: ProjectAssignment): ProjectAssignmentResponseDto {
    return {
      projectId: assignment.projectId,
      userId: assignment.userId,
      status: assignment.status,
      createdAt: assignment.createdAt.toISOString(),
      updatedAt: assignment.updatedAt.toISOString(),
    };
  }
}
