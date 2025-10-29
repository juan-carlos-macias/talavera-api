import { PrismaClient, Project, PlanType } from '@prisma/client';
import { ApiError } from '../utils/errors';
import httpStatus from 'http-status';
import { CreateProjectData, FREE_PLAN_PROJECT_LIMIT, UpdateProjectData } from '../types/project/project.types';


export class ProjectService {

  private readonly prisma: PrismaClient = new PrismaClient();

  async createProject(data: CreateProjectData): Promise<Project> {
    const { name, userId } = data;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { projects: true },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.plan === PlanType.FREE) {
      if (user.projects.length >= FREE_PLAN_PROJECT_LIMIT) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          `Free plan allows maximum ${FREE_PLAN_PROJECT_LIMIT} projects. Please upgrade to PRO plan.`
        );
      }
    }

    const project = await this.prisma.project.create({
      data: {
        name,
        userId,
      },
    });

    return project;
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return projects;
  }

  async getProjectById(projectId: string, userId: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }

    if (project.userId !== userId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access denied. You do not own this project.');
    }

    return project;
  }

  async updateProject(
    projectId: string,
    userId: string,
    data: UpdateProjectData
  ): Promise<Project> {
    await this.getProjectById(projectId, userId);

    const project = await this.prisma.project.update({
      where: { id: projectId },
      data: { name: data.name },
    });

    return project;
  }

  async deleteProject(projectId: string, userId: string): Promise<void> {
    await this.getProjectById(projectId, userId);

    await this.prisma.project.delete({
      where: { id: projectId },
    });
  }

  async getProjectCount(userId: string): Promise<number> {
    return await this.prisma.project.count({
      where: { userId },
    });
  }
}

export default new ProjectService();
