import { PlanType } from '@prisma/client';
import { randomUUID } from 'crypto';

export interface StripeAdapter {
  createSubscription(userId: string, planId: PlanType): Promise<string>;
}

class MockedStripeAdapter implements StripeAdapter {
  async createSubscription(userId: string, planId: PlanType): Promise<string> {
    const paymentIntentId = `pi_mock_${randomUUID()}`;
    
    console.log(`[Mocked Stripe] Creating subscription for user ${userId} with plan ${planId}`);
    console.log(`[Mocked Stripe] Generated payment intent: ${paymentIntentId}`);
    
    return paymentIntentId;
  }
}

export default new MockedStripeAdapter();
