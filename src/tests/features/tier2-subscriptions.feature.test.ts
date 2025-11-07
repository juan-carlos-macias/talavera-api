import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { App } from '@/app';

const app = new App().app;

let authToken: string;

describe('Feature: Subscription Management (Tier 2)', () => {
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

  describe('Scenario: Get Available Plans', () => {
    it('Given no authentication, When getting plans, Then should return all plans', async () => {
      const response = await request(app)
        .get('/api/plans');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('price');
      expect(response.body.data[0]).toHaveProperty('projectsQuota');
      expect(response.body.data[0]).toHaveProperty('features');
    });

    it('Given locale=en, When getting plans, Then should return plans in English', async () => {
      const response = await request(app)
        .get('/api/plans?locale=en');

      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toBe('Free Plan');
      expect(response.body.data[1].name).toBe('Pro Plan');
    });

    it('Given locale=es, When getting plans, Then should return plans in Spanish', async () => {
      const response = await request(app)
        .get('/api/plans?locale=es');

      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toBe('Plan Gratuito');
      expect(response.body.data[1].name).toBe('Plan Pro');
    });

    it('Given no locale, When getting plans, Then should default to English', async () => {
      const response = await request(app)
        .get('/api/plans');

      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toBe('Free Plan');
    });

    it('Given plans returned, When checking quotas, Then FREE should have 3 and PRO should have 10', async () => {
      const response = await request(app)
        .get('/api/plans');

      const freePlan = response.body.data.find((p: any) => p.id === 'FREE');
      const proPlan = response.body.data.find((p: any) => p.id === 'PRO');

      expect(freePlan.projectsQuota).toBe(3);
      expect(proPlan.projectsQuota).toBe(10);
    });
  });

  describe('Scenario: Create PRO Subscription', () => {
    it('Given valid PRO planId, When creating subscription, Then should create successfully', async () => {
      const response = await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: 'PRO' });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data.plan).toBe('PRO');
      expect(response.body.data).toHaveProperty('paymentIntentId');
      expect(response.body.data.paymentIntentId).toContain('pi_mock_');
      expect(response.body.data.status).toBe('paid');
    });

    it('Given no auth token, When creating subscription, Then should reject with 401', async () => {
      const response = await request(app)
        .post('/api/subscriptions')
        .send({ planId: 'PRO' });

      expect(response.status).toBe(401);
    });

    it('Given planId=FREE, When creating subscription, Then should reject with 400', async () => {
      const response = await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: 'FREE' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Cannot create subscription for FREE plan');
    });

    it('Given invalid planId, When creating subscription, Then should reject with 400', async () => {
      const response = await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: 'INVALID' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid plan ID');
    });

    it('Given missing planId, When creating subscription, Then should reject with 400', async () => {
      const response = await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('Given user already has PRO, When creating subscription, Then should reject with 409', async () => {
      await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: 'PRO' });

      const response = await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: 'PRO' });

      expect(response.status).toBe(409);
      expect(response.body.message).toContain('already has an active PRO subscription');
    });
  });

  describe('Scenario: Get Current Subscription', () => {
    it('Given FREE plan user, When getting current subscription, Then should return null', async () => {
      const response = await request(app)
        .get('/api/subscriptions/current')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
    });

    it('Given PRO plan user, When getting current subscription, Then should return subscription details', async () => {
      await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: 'PRO' });

      const response = await request(app)
        .get('/api/subscriptions/current')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeNull();
      expect(response.body.data.plan).toBe('PRO');
      expect(response.body.data).toHaveProperty('paymentIntentId');
      expect(response.body.data.status).toBe('paid');
    });

    it('Given no auth token, When getting current subscription, Then should reject with 401', async () => {
      const response = await request(app)
        .get('/api/subscriptions/current');

      expect(response.status).toBe(401);
    });
  });

  describe('Scenario: PRO Plan Project Quota (10 projects)', () => {
    it('Given PRO plan user, When creating 10 projects, Then should succeed', async () => {
      await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: 'PRO' });

      for (let i = 1; i <= 10; i++) {
        const response = await request(app)
          .post('/api/projects')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: `Project ${i}` });

        expect(response.status).toBe(201);
      }
    });

    it('Given PRO plan user with 10 projects, When creating 11th project, Then should reject with 403', async () => {
      await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: 'PRO' });

      for (let i = 1; i <= 10; i++) {
        await request(app)
          .post('/api/projects')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: `Project ${i}` });
      }

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Project 11' });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('10 projects');
    });

    it('Given FREE plan user with 3 projects upgrades to PRO, When creating 4th project, Then should succeed', async () => {
      for (let i = 1; i <= 3; i++) {
        await request(app)
          .post('/api/projects')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: `Project ${i}` });
      }

      await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: 'PRO' });

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Project 4' });

      expect(response.status).toBe(201);
    });
  });

  describe('Scenario: Mocked Stripe Integration', () => {
    it('Given subscription creation, When checking payment intent, Then should contain mock prefix', async () => {
      const response = await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: 'PRO' });

      expect(response.body.data.paymentIntentId).toMatch(/^pi_mock_/);
    });

    it('Given subscription creation, When checking invoice, Then should be created with paid status', async () => {
      const response = await request(app)
        .post('/api/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ planId: 'PRO' });

      expect(response.body.data.status).toBe('paid');
      expect(response.body.data).toHaveProperty('createdAt');
    });
  });
});
