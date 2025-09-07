import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";
import { RegisterDto, LoginDto, AuthResponse } from "../dto/auth.dto";
import { AppError } from "../../../utils/AppError";
import { config } from "../../../config/server";

const prisma = new PrismaClient();

export class AuthService {
  private generateTokens(userId: string, role: Role) {
    const payload = { userId, role: role.toString() };

    const accessToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const {
      name,
      email,
      password,
      role = Role.APPRENANT,
      promotionId,
    } = userData;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError("User with this email already exists", 400);
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Création de l'utilisateur selon le schéma Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        promotionId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Génération des tokens
    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.role
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token: accessToken,
      refreshToken,
    };
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Recherche de l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 400);
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 400);
    }

    // Génération des tokens
    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.role
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token: accessToken,
      refreshToken,
    };
  }

  async logout(token: string): Promise<void> {
    // In a production app, you might want to blacklist the token
    // For now, we'll just acknowledge the logout
    // You could store blacklisted tokens in Redis or database
    console.log(`User logged out with token: ${token.substring(0, 20)}...`);
  }

  async verifyToken(token: string): Promise<{ userId: string; role: Role }> {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as {
        userId: string;
        role: Role;
      };
      return decoded;
    } catch (error) {
      throw new AppError("Invalid or expired token", 401);
    }
  }
}
