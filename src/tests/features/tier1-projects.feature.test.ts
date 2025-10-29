import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { App } from '@/app';

const app = new App().app;

let authToken: string;
let userId: string;

describe('Feature: Project Management (Tier 1)', () => {
  beforeEach(async () => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: 'SecurePass123!',
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    authToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.user.id;
  });

  describe('Scenario: Create Project', () => {
    it('Given valid project data, When creating project, Then should create successfully', async () => {
      const projectData = {
        name: 'My First Project',
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData);

      expect(response.status).toBe(201);
      expect(response.body.data.project.name).toBe(projectData.name);
      expect(response.body.data.project).toHaveProperty('id');
    });

    it('Given no auth token, When creating project, Then should reject with 401', async () => {
      const projectData = {
        name: 'Unauthorized Project',
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData);

      expect(response.status).toBe(401);
    });

    it('Given empty project name, When creating project, Then should reject with 400', async () => {
      const projectData = {
        name: '',
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });

    it('Given project name too long, When creating project, Then should reject with 400', async () => {
      const projectData = {
        name: 'a'.repeat(101),
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('100 characters');
    });
  });

  describe('Scenario: FREE Plan Quota (3 projects)', () => {
    it('Given FREE plan user with 3 projects, When creating 4th project, Then should reject with 403', async () => {
      for (let i = 1; i <= 3; i++) {
        await request(app)
          .post('/api/projects')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: `Project ${i}` });
      }

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Project 4' });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('3 projects');
      expect(response.body.message).toContain('upgrade');
    });

    it('Given FREE plan user with 2 projects, When creating 3rd project, Then should succeed', async () => {
      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Project 1' });

      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Project 2' });

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Project 3' });

      expect(response.status).toBe(201);
    });
  });

  describe('Scenario: List Projects', () => {
    it('Given user with projects, When listing projects, Then should return all user projects', async () => {
      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Project 1' });

      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Project 2' });

      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.projects).toHaveLength(2);
    });

    it('Given no auth token, When listing projects, Then should reject with 401', async () => {
      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(401);
    });

    it('Given user with no projects, When listing projects, Then should return empty array', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.projects).toHaveLength(0);
    });
  });

  describe('Scenario: Get Project by ID', () => {
    it('Given valid project ID, When getting project, Then should return project details', async () => {
      const createResponse = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Project' });

      const projectId = createResponse.body.data.project.id;

      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.project.id).toBe(projectId);
      expect(response.body.data.project.name).toBe('Test Project');
    });

    it('Given non-existent project ID, When getting project, Then should reject with 404', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .get(`/api/projects/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });

    it('Given invalid project ID format, When getting project, Then should reject with 400', async () => {
      const response = await request(app)
        .get('/api/projects/invalid-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid');
    });

    it('Given another user project ID, When getting project, Then should reject with 403', async () => {
      const user2Data = {
        email: `user2-${Date.now()}@example.com`,
        password: 'SecurePass123!',
      };

      const user2Register = await request(app)
        .post('/api/auth/register')
        .send(user2Data);

      const user2Token = user2Register.body.data.token;

      const createResponse = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ name: 'User 2 Project' });

      const projectId = createResponse.body.data.project.id;

      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('do not own');
    });
  });

  describe('Scenario: Update Project', () => {
    it('Given valid update data, When updating project, Then should update successfully', async () => {
      const createResponse = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Original Name' });

      const projectId = createResponse.body.data.project.id;

      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.data.project.name).toBe('Updated Name');
    });

    it('Given empty name, When updating project, Then should reject with 400', async () => {
      const createResponse = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Project' });

      const projectId = createResponse.body.data.project.id;

      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: '' });

      expect(response.status).toBe(400);
    });

    it('Given another user project, When updating project, Then should reject with 403', async () => {
      const user2Data = {
        email: `user2-${Date.now()}@example.com`,
        password: 'SecurePass123!',
      };

      const user2Register = await request(app)
        .post('/api/auth/register')
        .send(user2Data);

      const user2Token = user2Register.body.data.token;

      const createResponse = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ name: 'User 2 Project' });

      const projectId = createResponse.body.data.project.id;

      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Hacked Name' });

      expect(response.status).toBe(403);
    });
  });

  describe('Scenario: Delete Project', () => {
    it('Given valid project ID, When deleting project, Then should delete successfully', async () => {
      const createResponse = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'To Delete' });

      const projectId = createResponse.body.data.project.id;

      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });

    it('Given another user project, When deleting project, Then should reject with 403', async () => {
      const user2Data = {
        email: `user2-${Date.now()}@example.com`,
        password: 'SecurePass123!',
      };

      const user2Register = await request(app)
        .post('/api/auth/register')
        .send(user2Data);

      const user2Token = user2Register.body.data.token;

      const createResponse = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ name: 'User 2 Project' });

      const projectId = createResponse.body.data.project.id;

      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
    });

    it('Given non-existent project, When deleting project, Then should reject with 404', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .delete(`/api/projects/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
