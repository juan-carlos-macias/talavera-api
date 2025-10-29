import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { App } from '@/app';

const app = new App().app;

describe('Feature: User Authentication (Tier 1)', () => {
  describe('Scenario: User Registration', () => {
    it('Given valid user data, When registering, Then should create new user account', async () => {
      const newUser = {
        email: 'user@example.com',
        password: 'SecurePass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(response.body.data).toHaveProperty('token');
    });

    it('Given duplicate email, When registering, Then should reject with 409 conflict', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'SecurePass123!',
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body.message).toContain('already exists');
    });

    it('Given invalid email format, When registering, Then should reject with 400 validation error', async () => {
      const invalidUser = {
        email: 'not-an-email',
        password: 'SecurePass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email format');
    });

    it('Given weak password, When registering, Then should reject with 400 validation error', async () => {
      const weakPasswordUser = {
        email: 'user@example.com',
        password: '123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(weakPasswordUser);

      expect(response.status).toBe(400);
      expect(response.body.message.toLowerCase()).toContain('password');
    });
  });

  describe('Scenario: User Login', () => {
    it('Given valid credentials, When logging in, Then should return JWT token', async () => {
      const userData = {
        email: 'login@example.com',
        password: 'SecurePass123!',
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const response = await request(app)
        .post('/api/auth/login')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it('Given wrong password, When logging in, Then should reject with 401 unauthorized', async () => {
      const userData = {
        email: 'wrongpass@example.com',
        password: 'SecurePass123!',
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('Given non-existent email, When logging in, Then should reject with 401 unauthorized', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid email or password');
    });
  });

  describe('Scenario: Protected Routes', () => {
    it('Given no token, When accessing protected route, Then should reject with 401', async () => {
      const response = await request(app)
        .get('/api/users/me');
      expect(response.status).toBe(401);
    });

    it('Given invalid token, When accessing protected route, Then should reject with 401', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    it('Given valid token, When accessing protected route, Then should return user data', async () => {
      const userData = {
        email: 'protected@example.com',
        password: 'SecurePass123!',
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      const token = registerResponse.body.data.token;

      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.user.email).toBe(userData.email);
    });
  });
});
