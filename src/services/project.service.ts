import { Project } from '@prisma/client';
import { ApiError } from '../utils/errors';
import httpStatus from 'http-status';
import { CreateProjectData, UpdateProjectData } from '../types/project/project.types';
import { PLAN_QUOTAS } from '../constants/plans.constants';
import prisma from '../lib/prisma';


export class ProjectService {

  async createProject(data: CreateProjectData): Promise<Project> {
    const { name, userId } = data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { projects: true },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const projectQuota = PLAN_QUOTAS[user.plan];
    
    if (user.projects.length >= projectQuota) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        `${user.plan} plan allows maximum ${projectQuota} projects. Please upgrade to PRO plan.`
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        userId,
      },
    });

    return project;
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return projects;
  }

  async getProjectById(projectId: string, userId: string): Promise<Project> {
    const project = await prisma.project.findUnique({
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

    const project = await prisma.project.update({
      where: { id: projectId },
      data: { name: data.name },
    });

    return project;
  }

  async deleteProject(projectId: string, userId: string): Promise<void> {
    await this.getProjectById(projectId, userId);

    await prisma.project.delete({
      where: { id: projectId },
    });
  }

  async getProjectCount(userId: string): Promise<number> {
    return await prisma.project.count({
      where: { userId },
    });
  }
}

export default new ProjectService();
