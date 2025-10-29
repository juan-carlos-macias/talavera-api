/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import winston from 'winston';
import Routes from '../routes';
import responseMiddleware from '../middlewares/response';
import {
  uncaughtExceptionLogger,
  configWinstonLogger,
} from './config/winston.config';
import { corsConfig } from './config/cors.config';
import { helmetConfig, helmetDevConfig } from './config/helmet.config';
import { ErrorConverter, ErrorHandler } from "../utils/errors";

export class App {
  public app: Application;
  private serverListener?: any;

  public constructor() {
    this.app = express();
    uncaughtExceptionLogger();
    configWinstonLogger();
    winston.debug('Logger configured ...');
    this.setMiddlewares();
    this.setRoutes();
    this.setErrorHandlers();
  }

  private setMiddlewares(): void {
    this.app.use(express.json());
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    this.app.use(helmet(isDevelopment ? helmetDevConfig : helmetConfig));
    this.app.use(cors(corsConfig));
    
    this.app.use(responseMiddleware);
    winston.debug('Middlewares configured ...');
  }

  private setRoutes(): void {
    const router = new Routes(this.app);
    router.setRoutes();
    winston.debug('Routes configured ...');  
}

private setErrorHandlers() {
  this.app.use(ErrorConverter);
  this.app.use(ErrorHandler);
  winston.debug('Error handlers configured ...');
}

  public listen(): void {
    const port = process.env.PORT || 3000;
    this.serverListener = this.app.listen(port, () => {
        winston.info(`🚀 Server running on port ${port} ...`);
    });
  }

  public async close(): Promise<void> {
    if (this.serverListener) {
      this.serverListener.close();
    }
  }
}
