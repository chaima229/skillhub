import { EvaluationCriteria } from "@prisma/client";
import {
  CreateEvaluationCriteriaDto,
  UpdateEvaluationCriteriaDto,
  GetEvaluationCriteriaQueryDto,
  EvaluationCriteriaResponseDto,
} from "../dto/evaluationCriteria.dto";
import { EvaluationCriteriaRepository } from "../repository/evaluationCriteria.repository";
import {
  NotFoundError,
  ConflictError,
} from "../../../utils/error-handler";

export class EvaluationCriteriaService {
  private evaluationCriteriaRepository: EvaluationCriteriaRepository;

  constructor() {
    this.evaluationCriteriaRepository = new EvaluationCriteriaRepository();
  }

  async createEvaluationCriteria(data: CreateEvaluationCriteriaDto): Promise<EvaluationCriteriaResponseDto> {
    const existingEvaluationCriteria = await this.evaluationCriteriaRepository.findMany({
      search: data.name,
      projectId: data.projectId,
      limit: 1
    });
    if (existingEvaluationCriteria.total > 0) {
      throw new ConflictError("EvaluationCriteria with this name already exists for this project");
    }
    const evaluationCriteria = await this.evaluationCriteriaRepository.create(data);
    return this.mapToResponseDto(evaluationCriteria);
  }

  async getEvaluationCriteria(query: GetEvaluationCriteriaQueryDto): Promise<{
    evaluationCriteria: EvaluationCriteriaResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.evaluationCriteriaRepository.findMany(query);
    return {
      evaluationCriteria: result.evaluationCriteria.map((ec) => this.mapToResponseDto(ec)),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getEvaluationCriteriaById(id: string): Promise<EvaluationCriteriaResponseDto> {
    const evaluationCriteria = await this.evaluationCriteriaRepository.findById(id);
    if (!evaluationCriteria) {
      throw new NotFoundError("EvaluationCriteria not found");
    }
    return this.mapToResponseDto(evaluationCriteria);
  }

  async updateEvaluationCriteria(
    id: string,
    updateData: UpdateEvaluationCriteriaDto
  ): Promise<EvaluationCriteriaResponseDto> {
    const existingEvaluationCriteria = await this.evaluationCriteriaRepository.findById(id);
    if (!existingEvaluationCriteria) {
      throw new NotFoundError("EvaluationCriteria not found");
    }

    if (updateData.name && updateData.name !== existingEvaluationCriteria.name) {
      const nameExists = await this.evaluationCriteriaRepository.findMany({
        search: updateData.name,
        projectId: existingEvaluationCriteria.projectId,
        limit: 1
      });
      if (nameExists.total > 0) {
        throw new ConflictError("EvaluationCriteria with this name already exists for this project");
      }
    }

    const updatedEvaluationCriteria = await this.evaluationCriteriaRepository.update(id, updateData);
    return this.mapToResponseDto(updatedEvaluationCriteria);
  }

  async deleteEvaluationCriteria(id: string): Promise<void> {
    const evaluationCriteria = await this.evaluationCriteriaRepository.findById(id);
    if (!evaluationCriteria) {
      throw new NotFoundError("EvaluationCriteria not found");
    }
    await this.evaluationCriteriaRepository.delete(id);
  }

  private mapToResponseDto(evaluationCriteria: EvaluationCriteria): EvaluationCriteriaResponseDto {
    return {
      id: evaluationCriteria.id,
      name: evaluationCriteria.name,
      weight: evaluationCriteria.weight,
      projectId: evaluationCriteria.projectId,
    };
  }
}
