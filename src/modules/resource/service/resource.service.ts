import { Resource } from "@prisma/client";
import { ResourceRepository } from "../repository/resource.repository";
import {
  CreateResourceDto,
  UpdateResourceDto,
  GetResourcesQueryDto,
  ResourceResponseDto,
} from "../dto/resource.dto";
import {
  NotFoundError,
  ConflictError,
} from "../../../utils/error-handler";

export class ResourceService {
  private resourceRepository: ResourceRepository;

  constructor() {
    this.resourceRepository = new ResourceRepository();
  }

  async createResource(data: CreateResourceDto): Promise<ResourceResponseDto> {
    // Check if a resource with the same URL already exists for the same project
    const existingResource = await this.resourceRepository.findMany({
      search: data.url,
      projectId: data.projectId,
      limit: 1
    });
    if (existingResource.total > 0) {
      throw new ConflictError("Resource with this URL already exists for this project");
    }
    const resource = await this.resourceRepository.create(data);
    return this.mapToResponseDto(resource);
  }

  async getResources(query: GetResourcesQueryDto): Promise<{
    resources: ResourceResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.resourceRepository.findMany(query);
    return {
      resources: result.resources.map((r) => this.mapToResponseDto(r)),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getResourceById(id: string): Promise<ResourceResponseDto> {
    const resource = await this.resourceRepository.findById(id);
    if (!resource) {
      throw new NotFoundError("Resource not found");
    }
    return this.mapToResponseDto(resource);
  }

  async updateResource(
    id: string,
    updateData: UpdateResourceDto
  ): Promise<ResourceResponseDto> {
    const existingResource = await this.resourceRepository.findById(id);
    if (!existingResource) {
      throw new NotFoundError("Resource not found");
    }

    // Check for duplicate URL for the same project, excluding the current resource
    if (updateData.url && updateData.url !== existingResource.url) {
      const urlExists = await this.resourceRepository.findMany({
        search: updateData.url,
        projectId: existingResource.projectId,
        limit: 1
      });
      if (urlExists.total > 0) {
        throw new ConflictError("Resource with this URL already exists for this project");
      }
    }

    const updatedResource = await this.resourceRepository.update(id, updateData);
    return this.mapToResponseDto(updatedResource);
  }

  async deleteResource(id: string): Promise<void> {
    const resource = await this.resourceRepository.findById(id);
    if (!resource) {
      throw new NotFoundError("Resource not found");
    }
    await this.resourceRepository.delete(id);
  }

  private mapToResponseDto(resource: Resource): ResourceResponseDto {
    return {
      id: resource.id,
      type: resource.type,
      url: resource.url,
      projectId: resource.projectId,
      createdAt: resource.createdAt.toISOString(),
      updatedAt: resource.updatedAt.toISOString(),
    };
  }
}
