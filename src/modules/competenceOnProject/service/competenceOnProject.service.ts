import { CompetenceOnProject } from "@prisma/client";
import {
  CreateCompetenceOnProjectDto,
  UpdateCompetenceOnProjectDto,
  GetCompetenceOnProjectsQueryDto,
  CompetenceOnProjectResponseDto,
} from "../dto/competenceOnProject.dto";
import { CompetenceOnProjectRepository } from "../repository/competenceOnProject.repository";
import {
  NotFoundError,
  ConflictError,
} from "../../../utils/error-handler";

export class CompetenceOnProjectService {
  private competenceOnProjectRepository: CompetenceOnProjectRepository;

  constructor() {
    this.competenceOnProjectRepository = new CompetenceOnProjectRepository();
  }

  async createCompetenceOnProject(data: CreateCompetenceOnProjectDto): Promise<CompetenceOnProjectResponseDto> {
    const existingCompetenceOnProject = await this.competenceOnProjectRepository.findByIds(data.projectId, data.competenceId);
    if (existingCompetenceOnProject) {
      throw new ConflictError("Competence already assigned to this project");
    }
    const competenceOnProject = await this.competenceOnProjectRepository.create(data);
    return this.mapToResponseDto(competenceOnProject);
  }

  async getCompetenceOnProjects(query: GetCompetenceOnProjectsQueryDto): Promise<{
    competenceOnProjects: CompetenceOnProjectResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.competenceOnProjectRepository.findMany(query);
    return {
      competenceOnProjects: result.competenceOnProjects.map((cop) => this.mapToResponseDto(cop)),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getCompetenceOnProjectByIds(
    projectId: string,
    competenceId: string
  ): Promise<CompetenceOnProjectResponseDto> {
    const competenceOnProject = await this.competenceOnProjectRepository.findByIds(projectId, competenceId);
    if (!competenceOnProject) {
      throw new NotFoundError("Competence on project not found");
    }
    return this.mapToResponseDto(competenceOnProject);
  }

  async updateCompetenceOnProject(
    projectId: string,
    competenceId: string,
    updateData: UpdateCompetenceOnProjectDto
  ): Promise<CompetenceOnProjectResponseDto> {
    const existingCompetenceOnProject = await this.competenceOnProjectRepository.findByIds(projectId, competenceId);
    if (!existingCompetenceOnProject) {
      throw new NotFoundError("Competence on project not found");
    }

    const updatedCompetenceOnProject = await this.competenceOnProjectRepository.update(projectId, competenceId, updateData);
    return this.mapToResponseDto(updatedCompetenceOnProject);
  }

  async deleteCompetenceOnProject(
    projectId: string,
    competenceId: string
  ): Promise<void> {
    const competenceOnProject = await this.competenceOnProjectRepository.findByIds(projectId, competenceId);
    if (!competenceOnProject) {
      throw new NotFoundError("Competence on project not found");
    }
    await this.competenceOnProjectRepository.delete(projectId, competenceId);
  }

  private mapToResponseDto(competenceOnProject: CompetenceOnProject): CompetenceOnProjectResponseDto {
    return {
      projectId: competenceOnProject.projectId,
      competenceId: competenceOnProject.competenceId,
    };
  }
}
