import { Request, Response } from 'express';
import subscriptionService from '../services/subscription.service';

class SubscriptionController {
  async getPlans(req: Request, res: Response) {
    const locale = (req.query.locale as string);
    const plans = await subscriptionService.getAllPlans(locale);
    
    res.status(200).json({
      success: true,
      data: plans,
    });
  }

  async createSubscription(req: Request, res: Response) {
    const userId = req.user!.id;
    const { planId } = req.body;
    
    const subscription = await subscriptionService.createSubscription(userId, planId);
    
    res.status(201).json({
      success: true,
      data: subscription,
    });
  }

  async getCurrentSubscription(req: Request, res: Response) {
    const userId = req.user!.id;
    const subscription = await subscriptionService.getCurrentSubscription(userId);
    
    res.status(200).json({
      success: true,
      data: subscription,
    });
  }
}

export default new SubscriptionController();
