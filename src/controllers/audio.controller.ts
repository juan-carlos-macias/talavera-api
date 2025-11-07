import { Request, Response } from 'express';
import audioService from '../services/audio.service';
import httpStatus from 'http-status';

class AudioController {
  public async analyzeAudio(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    if (!req.file) {
      res.respond(
        {
          message: 'No audio file provided',
        },
        httpStatus.BAD_REQUEST,
      );
      return;
    }

    const analysis = await audioService.analyzeAudio(
      req!.file.buffer,
      req!.file.originalname,
      userId,
    );

    const audioSummary = await audioService.createAudioSummary({
      ownerId: userId,
      title: analysis.title,
      keywords: analysis.keywords,
      transcript: analysis.transcript,
      summary: analysis.summary,
    });

    res.respond(
      {
        message: 'Audio analyzed successfully',
        data: { audioSummary },
      },
      httpStatus.CREATED,
    );
  }

  public async getUserSummaries(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const summaries = await audioService.getUserAudioSummaries(userId);

    res.respond(
      {
        message: 'Audio summaries retrieved successfully',
        data: { summaries },
      },
      httpStatus.OK,
    );
  }

  public async getSummaryById(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const summary = await audioService.getAudioSummaryById(id, userId);

    res.respond(
      {
        message: 'Audio summary retrieved successfully',
        data: { summary },
      },
      httpStatus.OK,
    );
  }

  public async deleteSummary(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    await audioService.deleteAudioSummary(id, userId);

    res.status(httpStatus.NO_CONTENT).send();
  }
}

export default new AudioController();
