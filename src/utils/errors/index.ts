/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import winston from 'winston';
import ApiError from './ApiError';

const ErrorConverter = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!(err instanceof ApiError)) {
      const statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  
      const message: string =
        err.message ||
        (httpStatus as unknown as Record<number, string>)[statusCode] ||
        "Internal Server Error";
  
      err = new ApiError(statusCode, message, false, err.stack);
    }
  
    next(err);
  };
  

const ErrorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { statusCode, message } = err;
  
    const response = {
      code: statusCode,
      message,
    };
  
    winston.error(err.stack);
    res.status(statusCode).json(response);
  };

export { ErrorConverter, ErrorHandler, ApiError };
