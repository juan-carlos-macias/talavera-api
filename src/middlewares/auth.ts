import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import httpStatus from 'http-status';
import authService from '../services/auth.service';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'No authorization token provided');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid authorization format. Use: Bearer <token>');
    }

    const token = parts[1];

    const payload = authService.verifyToken(token);

    const user = await authService.getUserById(payload.id);

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
