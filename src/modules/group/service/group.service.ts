import { Group } from "@prisma/client";
import {
  CreateGroupDto,
  UpdateGroupDto,
  GetGroupsQueryDto,
  GroupResponseDto,
} from "../dto/group.dto";
import { GroupRepository } from "../repository/group.repository";
import {
  NotFoundError,
  ConflictError,
} from "../../../utils/error-handler";

export class GroupService {
  private groupRepository: GroupRepository;

  constructor() {
    this.groupRepository = new GroupRepository();
  }

  async createGroup(data: CreateGroupDto): Promise<GroupResponseDto> {
    const existingGroup = await this.groupRepository.findMany({
      search: data.name,
      limit: 1
    });
    if (existingGroup.total > 0) {
      throw new ConflictError("Group with this name already exists");
    }
    const group = await this.groupRepository.create(data);
    return this.mapToResponseDto(group);
  }

  async getGroups(query: GetGroupsQueryDto): Promise<{
    groups: GroupResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.groupRepository.findMany(query);
    return {
      groups: result.groups.map((g) => this.mapToResponseDto(g)),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getGroupById(id: string): Promise<GroupResponseDto> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundError("Group not found");
    }
    return this.mapToResponseDto(group);
  }

  async updateGroup(
    id: string,
    updateData: UpdateGroupDto
  ): Promise<GroupResponseDto> {
    const existingGroup = await this.groupRepository.findById(id);
    if (!existingGroup) {
      throw new NotFoundError("Group not found");
    }

    if (updateData.name && updateData.name !== existingGroup.name) {
      const nameExists = await this.groupRepository.findMany({
        search: updateData.name,
        limit: 1
      });
      if (nameExists.total > 0) {
        throw new ConflictError("Group with this name already exists");
      }
    }

    const updatedGroup = await this.groupRepository.update(id, updateData);
    return this.mapToResponseDto(updatedGroup);
  }

  async deleteGroup(id: string): Promise<void> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundError("Group not found");
    }
    await this.groupRepository.delete(id);
  }

  private mapToResponseDto(group: Group): GroupResponseDto {
    return {
      id: group.id,
      name: group.name,
      promotionId: group.promotionId,
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString(),
    };
  }
}
