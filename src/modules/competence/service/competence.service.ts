import { Competence } from "@prisma/client";
import {
  CreateCompetenceDto,
  UpdateCompetenceDto,
  GetCompetencesQueryDto,
  CompetenceResponseDto,
} from "../dto/competence.dto";
import { CompetenceRepository } from "../repository/competence.repository";
import {
  NotFoundError,
  ConflictError,
} from "../../../utils/error-handler";

export class CompetenceService {
  private competenceRepository: CompetenceRepository;

  constructor() {
    this.competenceRepository = new CompetenceRepository();
  }

  async createCompetence(data: CreateCompetenceDto): Promise<CompetenceResponseDto> {
    const existingCompetence = await this.competenceRepository.findMany({
      search: data.name,
      limit: 1
    });
    if (existingCompetence.total > 0) {
      throw new ConflictError("Competence with this name already exists");
    }
    const competence = await this.competenceRepository.create(data);
    return this.mapToResponseDto(competence);
  }

  async getCompetences(query: GetCompetencesQueryDto): Promise<{
    competences: CompetenceResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.competenceRepository.findMany(query);
    return {
      competences: result.competences.map((c) => this.mapToResponseDto(c)),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getCompetenceById(id: string): Promise<CompetenceResponseDto> {
    const competence = await this.competenceRepository.findById(id);
    if (!competence) {
      throw new NotFoundError("Competence not found");
    }
    return this.mapToResponseDto(competence);
  }

  async updateCompetence(
    id: string,
    updateData: UpdateCompetenceDto
  ): Promise<CompetenceResponseDto> {
    const existingCompetence = await this.competenceRepository.findById(id);
    if (!existingCompetence) {
      throw new NotFoundError("Competence not found");
    }

    if (updateData.name && updateData.name !== existingCompetence.name) {
      const nameExists = await this.competenceRepository.findMany({
        search: updateData.name,
        limit: 1
      });
      if (nameExists.total > 0) {
        throw new ConflictError("Competence with this name already exists");
      }
    }

    const updatedCompetence = await this.competenceRepository.update(id, updateData);
    return this.mapToResponseDto(updatedCompetence);
  }

  async deleteCompetence(id: string): Promise<void> {
    const competence = await this.competenceRepository.findById(id);
    if (!competence) {
      throw new NotFoundError("Competence not found");
    }
    await this.competenceRepository.delete(id);
  }

  private mapToResponseDto(competence: Competence): CompetenceResponseDto {
    return {
      id: competence.id,
      name: competence.name,
      level: competence.level,
      createdAt: competence.createdAt.toISOString(),
      updatedAt: competence.updatedAt.toISOString(),
    };
  }
}
