import { PlanType } from '@prisma/client';

export interface PlanInfo {
  id: PlanType;
  name: string;
  description: string;
  price: number;
  currency: string;
  projectsQuota: number;
  features: string[];
}

export interface CreateSubscriptionData {
  planId: PlanType;
}

export interface SubscriptionResponse {
  userId: string;
  plan: PlanType;
  paymentIntentId: string;
  status: string;
  createdAt: Date;
}
