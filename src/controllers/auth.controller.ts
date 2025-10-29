import { Request, Response } from 'express';
import authService from '../services/auth.service';
import httpStatus from 'http-status';

class AuthController {
  public async signup(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const result = await authService.signup({ email, password });

    res.respond(
      {
        message: 'User registered successfully',
        data: result,
      },
      httpStatus.CREATED
    );
  }

  public async signin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const result = await authService.signin({ email, password });

    res.respond(
      {
        message: 'Login successful',
        data: result,
      },
      httpStatus.OK
    );
  }

  public async getMe(req: Request, res: Response): Promise<void> {
    
    const userId = req.user!.id;

    const user = await authService.getUserById(userId);

    res.respond(
      {
        message: 'User retrieved successfully',
        data: { user },
      },
      httpStatus.OK
    );
  }
}

export default new AuthController();
