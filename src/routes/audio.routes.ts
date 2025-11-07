import { Router } from 'express';
import audioController from '../controllers/audio.controller';
import validate from '../middlewares/validate';
import { audioSummaryIdSchema } from '../utils/validation.schemas';
import { authenticate } from '../middlewares/auth';
import catchAsync from '../middlewares/catchAsync';
import upload from '../middlewares/upload';


class AudioRoutes {
  public router: Router = Router();

  constructor() {
    this.router.use(authenticate);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', catchAsync(audioController.getUserSummaries));

    this.router.post(
      '/analyze',
      upload.single('audio'),
      catchAsync(audioController.analyzeAudio),
    );

    this.router.get(
      '/:id',
      validate.params(audioSummaryIdSchema),
      catchAsync(audioController.getSummaryById),
    );

    this.router.delete(
      '/:id',
      validate.params(audioSummaryIdSchema),
      catchAsync(audioController.deleteSummary),
    );
  }
}

export default new AudioRoutes();
