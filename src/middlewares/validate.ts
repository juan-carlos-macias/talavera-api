import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from '../utils/errors';
import httpStatus from 'http-status';

class Validations {
  private handleValidationError(error: unknown, next: NextFunction): void {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((issue) => issue.message).join(', ');
      next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    } else {
      next(error);
    }
  }

  body(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        this.handleValidationError(error, next);
      }
    };
  }

  params(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req.params = schema.parse(req.params) as typeof req.params;
        next();
      } catch (error) {
        this.handleValidationError(error, next);
      }
    };
  }
}

export default new Validations();
