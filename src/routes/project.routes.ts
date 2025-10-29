import { Router } from 'express';
import projectController from '../controllers/project.controller';
import validate from '../middlewares/validate';
import { createProjectSchema, updateProjectSchema, projectIdSchema } from '../utils/validation.schemas';
import { authenticate } from '../middlewares/auth';
import catchAsync from '../middlewares/catchAsync';

class ProjectRoutes {
  public router: Router = Router();

  constructor() {
    this.router.use(authenticate);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', catchAsync(projectController.getProjects));

    this.router.post(
      '/',
      validate.body(createProjectSchema),
      catchAsync(projectController.createProject)
    );

    this.router.get(
      '/:id',
      validate.params(projectIdSchema),
      catchAsync(projectController.getProject)
    );

    this.router.put(
      '/:id',
      validate.params(projectIdSchema),
      validate.body(updateProjectSchema),
      catchAsync(projectController.updateProject)
    );

    this.router.delete(
      '/:id',
      validate.params(projectIdSchema),
      catchAsync(projectController.deleteProject)
    );
  }
}

export default new ProjectRoutes();
