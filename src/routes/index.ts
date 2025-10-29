import { Application } from 'express';
import httpStatus from 'http-status';
import { ApiError } from '../utils/errors';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';

export default class Routes {
    public app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public setRoutes(): void {
        this.app.get('/', (req, res) => {
            res.respond(
                {
                    message: 'Welcome to Talavera API',
                    data: {
                        version: '1.0.0',
                        status: 'running',
                    },
                },
                httpStatus.OK
            );
        });

        this.app.use('/api/auth', authRoutes.router);
        this.app.use('/api/users', authRoutes.router);
        this.app.use('/api/projects', projectRoutes.router);

        this.app.use((req, res, next) => {
            next(new ApiError(httpStatus.NOT_FOUND, 'Route Not found'));
        });
    }
}
