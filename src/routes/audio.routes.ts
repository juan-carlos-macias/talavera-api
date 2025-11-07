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
    // Get all audio summaries for the user
    this.router.get('/', catchAsync(audioController.getUserSummaries));

    // Analyze audio file
    this.router.post(
      '/analyze',
      upload.single('audio'),
      catchAsync(audioController.analyzeAudio),
    );

    // Get specific audio summary by ID
    this.router.get(
      '/:id',
      validate.params(audioSummaryIdSchema),
      catchAsync(audioController.getSummaryById),
    );

    // Delete audio summary
    this.router.delete(
      '/:id',
      validate.params(audioSummaryIdSchema),
      catchAsync(audioController.deleteSummary),
    );
  }
}

export default new AudioRoutes();
