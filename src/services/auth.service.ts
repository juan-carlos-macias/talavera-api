import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/errors';
import httpStatus from 'http-status';
import { SignupData, SigninData, TokenPayload, SALT_ROUNDS } from '../types/auth/auth.types';
import prisma from '../lib/prisma';

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  }

  async signup(data: SignupData): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const { email, password } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(httpStatus.CONFLICT, 'User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        plan: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = this.generateToken({ id: user.id, email: user.email });

    return {
      user,
      token,
    };
  }

  async signin(data: SigninData): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    const token = this.generateToken({ id: user.id, email: user.email });

    const userWithoutPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        plan: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      user: userWithoutPassword!,
      token,
    };
  }

  private generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
    } catch {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
    }
  }

  async getUserById(userId: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        plan: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }
}

export default new AuthService();
