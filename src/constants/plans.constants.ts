import { PlanType } from '@prisma/client';
import { PlanInfo } from '../types/subscription/subscription.types';

export const PLAN_QUOTAS = {
  FREE: 3,
  PRO: 10,
};

export const PLANS: Record<string, PlanInfo> = {
  FREE: {
    id: 'FREE' as PlanType,
    name: 'Free Plan',
    description: 'Perfect for getting started',
    price: 0,
    currency: 'USD',
    projectsQuota: PLAN_QUOTAS.FREE,
    features: [
      'Up to 3 projects',
      'Basic support',
      'Community access',
    ],
  },
  PRO: {
    id: 'PRO' as PlanType,
    name: 'Pro Plan',
    description: 'For professional developers',
    price: 29.99,
    currency: 'USD',
    projectsQuota: PLAN_QUOTAS.PRO,
    features: [
      'Up to 10 projects',
      'Priority support',
      'Advanced analytics',
      'Custom domains',
    ],
  },
};

export const PLAN_TRANSLATIONS: Record<string, { name: string; description: string; features: string[] }> = {
  FREE: {
    name: 'Plan Gratuito',
    description: 'Perfecto para comenzar',
    features: [
      'Hasta 3 proyectos',
      'Soporte básico',
      'Acceso a la comunidad',
    ],
  },
  PRO: {
    name: 'Plan Pro',
    description: 'Para desarrolladores profesionales',
    features: [
      'Hasta 10 proyectos',
      'Soporte prioritario',
      'Analíticas avanzadas',
      'Dominios personalizados',
    ],
  },
};
