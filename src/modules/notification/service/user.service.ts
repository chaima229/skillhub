import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { config } from "../../../config/server";
import { UserRepository } from "../repository/user.repository";

import {
  CreateUserDto,
  UpdateUserDto,
  LoginUserDto,
  ChangePasswordDto,
  GetUsersQueryDto,
  UserResponseDto,
} from "../dto/user.dto";

import {
  NotFoundError,
  ConflictError,
  AuthenticationError,
  ValidationError,
} from "../../../utils/error-handler";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: CreateUserDto): Promise<{
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
  }> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(
      userData.password,
      Number(config.BCRYPT_ROUNDS)
    );

    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = this.generateTokens(user);

    return {
      user: this.mapToResponseDto(user),
      accessToken,
      refreshToken,
    };
  }

  async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(
      userData.password,
      Number(config.BCRYPT_ROUNDS)
    );

    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.mapToResponseDto(user);
  }

  async login(credentials: LoginUserDto): Promise<{
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    const { accessToken, refreshToken } = this.generateTokens(user);

    return {
      user: this.mapToResponseDto(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        config.JWT_REFRESH_SECRET
      ) as any;

      const user = await this.userRepository.findById(decoded.id);
      if (!user) {
        throw new AuthenticationError("Invalid refresh token");
      }

      return this.generateTokens(user);
    } catch {
      throw new AuthenticationError("Invalid refresh token");
    }
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return this.mapToResponseDto(user);
  }

  async updateProfile(
    userId: string,
    updateData: UpdateUserDto
  ): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await this.userRepository.existsByEmail(
        updateData.email,
        userId
      );
      if (emailExists) {
        throw new ConflictError("Email is already in use");
      }
    }

    const updatedUser = await this.userRepository.update(userId, updateData);
    return this.mapToResponseDto(updatedUser);
  }

  async changePassword(
    userId: string,
    passwordData: ChangePasswordDto
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      passwordData.currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new ValidationError("Current password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(
      passwordData.newPassword,
      Number(config.BCRYPT_ROUNDS)
    );

    await this.userRepository.updatePassword(userId, hashedNewPassword);
  }

  async getUsers(query: GetUsersQueryDto): Promise<{
    users: UserResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.userRepository.findMany(query);

    return {
      users: result.users.map((u) => this.mapToResponseDto(u)),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return this.mapToResponseDto(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    await this.userRepository.delete(id);
  }

  // ======================
  // Helpers
  // ======================
  private generateTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = { id: user.id, email: user.email, role: user.role };

    const accessToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      promotionId: user.promotionId,
      createdAt: user.createdAt,
    };
  }
}
