import { Project } from "@prisma/client";
import {
  CreateProjectDto,
  UpdateProjectDto,
  GetProjectsQueryDto,
  ProjectResponseDto,
} from "../dto/project.dto";
import { ProjectRepository } from "../repository/project.repository";
import {
  NotFoundError,
  ConflictError,
} from "../../../utils/error-handler";

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async createProject(data: CreateProjectDto): Promise<ProjectResponseDto> {
    // Check if a project with the same title already exists for the same creator
    const existingProject = await this.projectRepository.findMany({
      search: data.title,
      createdById: data.createdById,
      limit: 1
    });
    if (existingProject.total > 0) {
      throw new ConflictError("Project with this title already exists for this creator");
    }
    const project = await this.projectRepository.create(data);
    return this.mapToResponseDto(project);
  }

  async getProjects(query: GetProjectsQueryDto): Promise<{
    projects: ProjectResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.projectRepository.findMany(query);
    return {
      projects: result.projects.map((p) => this.mapToResponseDto(p)),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getProjectById(id: string): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError("Project not found");
    }
    return this.mapToResponseDto(project);
  }

  async updateProject(
    id: string,
    updateData: UpdateProjectDto
  ): Promise<ProjectResponseDto> {
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new NotFoundError("Project not found");
    }

    // Check for duplicate title for the same creator, excluding the current project
    if (updateData.title && updateData.title !== existingProject.title) {
      const titleExists = await this.projectRepository.findMany({
        search: updateData.title,
        createdById: existingProject.createdById,
        limit: 1
      });
      if (titleExists.total > 0) {
        throw new ConflictError("Project with this title already exists for this creator");
      }
    }

    const updatedProject = await this.projectRepository.update(id, updateData);
    return this.mapToResponseDto(updatedProject);
  }

  async deleteProject(id: string): Promise<void> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError("Project not found");
    }
    await this.projectRepository.delete(id);
  }

  private mapToResponseDto(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      objectives: project.objectives,
      deadline: project.deadline?.toISOString(),
      createdById: project.createdById,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }
}
