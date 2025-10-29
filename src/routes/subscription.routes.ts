import { Router } from 'express';
import subscriptionController from '../controllers/subscription.controller';
import validate from '../middlewares/validate';
import { createSubscriptionSchema } from '../utils/validation.schemas';
import { authenticate } from '../middlewares/auth';
import catchAsync from '../middlewares/catchAsync';

class SubscriptionRoutes {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/plans', catchAsync(subscriptionController.getPlans));

    this.router.post(
      '/subscriptions',
      authenticate,
      validate.body(createSubscriptionSchema),
      catchAsync(subscriptionController.createSubscription)
    );

    this.router.get(
      '/subscriptions/current',
      authenticate,
      catchAsync(subscriptionController.getCurrentSubscription)
    );
  }
}

export default new SubscriptionRoutes();
