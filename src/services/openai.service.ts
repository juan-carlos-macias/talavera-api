import OpenAI from 'openai';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { ApiError } from '../utils/errors';
import httpStatus from 'http-status';


class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }


  async transcribeAudio(
    audioBuffer: Buffer,
    filename: string,
  ): Promise<string> {
    const tempDir = '/tmp';
    const fileExtension = path.extname(filename) || '.m4a';
    const tempFilePath = path.join(tempDir, `temp-${Date.now()}${fileExtension}`);

    try {
      await fs.writeFile(tempFilePath, audioBuffer);

      const fileStream = fsSync.createReadStream(tempFilePath);

      const transcription = await this.openai.audio.transcriptions.create({
        file: fileStream,
        model: 'whisper-1',
        language: 'es',
        response_format: 'text',
      });

      await fs.unlink(tempFilePath);

      return transcription as string;
    } catch (error) {
      try {
        await fs.unlink(tempFilePath);
      } catch {
      }

      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

}

export default new OpenAIService();
