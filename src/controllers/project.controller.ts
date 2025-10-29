import { Request, Response } from 'express';
import projectService from '../services/project.service';
import httpStatus from 'http-status';

class ProjectController {
  public async createProject(req: Request, res: Response): Promise<void> {

    const userId = req.user!.id;

    const { name } = req.body;

    const project = await projectService.createProject({
      name,
      userId,
    });

    res.respond(
      {
        message: 'Project created successfully',
        data: { project },
      },
      httpStatus.CREATED
    );
  }

  public async getProjects(req: Request, res: Response): Promise<void> {

    const userId = req.user!.id;

    const projects = await projectService.getProjectsByUserId(userId);

    res.respond(
      {
        message: 'Projects retrieved successfully',
        data: { projects },
      },
      httpStatus.OK
    );
  }

  public async getProject(req: Request, res: Response): Promise<void> {

    const userId = req.user!.id;

    const { id } = req.params;

    const project = await projectService.getProjectById(id, userId);

    res.respond(
      {
        message: 'Project retrieved successfully',
        data: { project },
      },
      httpStatus.OK
    );
  }

  public async updateProject(req: Request, res: Response): Promise<void> {
    
    const userId = req.user!.id;

    const { id } = req.params;
    const { name } = req.body;

    const project = await projectService.updateProject(id, userId, { name });

    res.respond(
      {
        message: 'Project updated successfully',
        data: { project },
      },
      httpStatus.OK
    );
  }

  public async deleteProject(req: Request, res: Response): Promise<void> {
   
    const userId = req.user!.id;

    const { id } = req.params;

    await projectService.deleteProject(id, userId);

    res.status(httpStatus.NO_CONTENT).send();
  }
}

export default new ProjectController();
