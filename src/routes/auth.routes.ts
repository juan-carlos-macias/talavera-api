import { Router } from 'express';
import authController from '../controllers/auth.controller';
import validate from '../middlewares/validate';
import { signupSchema, signinSchema } from '../utils/validation.schemas';
import { authenticate } from '../middlewares/auth';
import catchAsync from '../middlewares/catchAsync';

class AuthRoutes {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/register',
      validate.body(signupSchema),
      catchAsync(authController.signup)
    );

    this.router.post(
      '/login',
      validate.body(signinSchema),
      catchAsync(authController.signin)
    );

    this.router.get(
      '/me',
      catchAsync(authenticate),
      catchAsync(authController.getMe)
    );
  }
}

export default new AuthRoutes();
