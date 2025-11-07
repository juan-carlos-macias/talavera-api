import prisma from '../lib/prisma';
import audioAgentService from './audio-agent.service';
import type {
  AudioAnalysisResult,
  CreateAudioSummaryData,
  AudioSummaryResponse,
} from '../types/audio/audio.types';

class AudioAnalysisService {

  async analyzeAudio(
    audioBuffer: Buffer,
    filename: string,
    userId: string,
  ): Promise<AudioAnalysisResult> {
    return audioAgentService.analyzeAudio(audioBuffer, filename, userId);
  }

  async createAudioSummary(
    data: CreateAudioSummaryData,
  ): Promise<AudioSummaryResponse> {
      const audioSummary = await prisma.audioSummary.create({
        data: {
          ownerId: data.ownerId,
          title: data.title,
          keywords: data.keywords,
          transcript: data.transcript,
          summary: data.summary,
        },
      });

      return audioSummary;
    
  }

  async getUserAudioSummaries(userId: string): Promise<AudioSummaryResponse[]> {
      const summaries = await prisma.audioSummary.findMany({
        where: {
          ownerId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return summaries;
  
  }

  async getAudioSummaryById(
    id: string,
    userId: string,
  ): Promise<AudioSummaryResponse | null> {
      const summary = await prisma.audioSummary.findFirst({
        where: {
          id,
          ownerId: userId,
        },
      });

      return summary;
    
  }


  async deleteAudioSummary(id: string, userId: string): Promise<void> {
      await prisma.audioSummary.deleteMany({
        where: {
          id,
          ownerId: userId,
        },
      });
  }
}

export default new AudioAnalysisService();
