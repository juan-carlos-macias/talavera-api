import { PlanType } from '@prisma/client';
import { ApiError } from '../utils/errors';
import httpStatus from 'http-status';
import stripeAdapter from '../adapters/stripe.adapter';
import { PlanInfo, SubscriptionResponse } from '../types/subscription/subscription.types';
import { PLANS, PLAN_QUOTAS, PLAN_TRANSLATIONS } from '../constants/plans.constants';
import prisma from '../lib/prisma';

export class SubscriptionService {

  async getAllPlans(locale: string = 'en'): Promise<PlanInfo[]> {
    const plans = Object.values(PLANS);
    
    if (locale === 'es') {
      return plans.map(plan => this.translatePlan(plan));
    }
    
    return plans;
  }

  private translatePlan(plan: PlanInfo): PlanInfo {
    const translation = PLAN_TRANSLATIONS[plan.id];
    return {
      ...plan,
      name: translation.name,
      description: translation.description,
      features: translation.features,
    };
  }

  async createSubscription(userId: string, planId: PlanType): Promise<SubscriptionResponse> {
    if (planId === 'FREE') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot create subscription for FREE plan');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.plan === 'PRO') {
      throw new ApiError(httpStatus.CONFLICT, 'User already has an active PRO subscription');
    }

    const paymentIntentId = await stripeAdapter.createSubscription(userId, planId);

    const invoice = await prisma.invoice.create({
      data: {
        userId,
        plan: planId,
        paymentIntent: paymentIntentId,
        status: 'paid',
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { plan: planId },
    });

    return {
      userId: invoice.userId,
      plan: invoice.plan,
      paymentIntentId: invoice.paymentIntent,
      status: invoice.status,
      createdAt: invoice.createdAt,
    };
  }

  async getCurrentSubscription(userId: string): Promise<SubscriptionResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        plan: true,
      },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.plan === 'FREE') {
      return null;
    }

    const latestInvoice = await prisma.invoice.findFirst({
      where: {
        userId,
        plan: user.plan,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!latestInvoice) {
      return null;
    }

    return {
      userId: latestInvoice.userId,
      plan: latestInvoice.plan,
      paymentIntentId: latestInvoice.paymentIntent,
      status: latestInvoice.status,
      createdAt: latestInvoice.createdAt,
    };
  }

  getProjectQuota(plan: PlanType): number {
    return PLAN_QUOTAS[plan];
  }
}

export default new SubscriptionService();
