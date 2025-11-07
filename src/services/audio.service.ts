import prisma from '../lib/prisma';
import audioAgentService from './audio-agent.service';
import type {
  AudioAnalysisResult,
  CreateAudioSummaryData,
  AudioSummaryResponse,
} from '../types/audio/audio.types';

class AudioAnalysisService {
  /**
   * Analyze audio file using AudioAgentService
   */
  async analyzeAudio(
    audioBuffer: Buffer,
    filename: string,
    userId: string,
  ): Promise<AudioAnalysisResult> {
    return audioAgentService.analyzeAudio(audioBuffer, filename, userId);
  }

  /**
   * Create a new audio summary in the database
   */
  async createAudioSummary(
    data: CreateAudioSummaryData,
  ): Promise<AudioSummaryResponse> {
    try {
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
    } catch (error) {
      console.error('Error creating audio summary:', error);
      throw new Error(
        `Failed to create audio summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
  /**
   * Get all audio summaries for a user
   */
  async getUserAudioSummaries(userId: string): Promise<AudioSummaryResponse[]> {
    try {
      const summaries = await prisma.audioSummary.findMany({
        where: {
          ownerId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return summaries;
    } catch (error) {
      console.error('Error fetching audio summaries:', error);
      throw new Error(
        `Failed to fetch audio summaries: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get a specific audio summary by ID
   */
  async getAudioSummaryById(
    id: string,
    userId: string,
  ): Promise<AudioSummaryResponse | null> {
    try {
      const summary = await prisma.audioSummary.findFirst({
        where: {
          id,
          ownerId: userId,
        },
      });

      return summary;
    } catch (error) {
      console.error('Error fetching audio summary:', error);
      throw new Error(
        `Failed to fetch audio summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Delete an audio summary
   */
  async deleteAudioSummary(id: string, userId: string): Promise<void> {
    try {
      await prisma.audioSummary.deleteMany({
        where: {
          id,
          ownerId: userId,
        },
      });
    } catch (error) {
      console.error('Error deleting audio summary:', error);
      throw new Error(
        `Failed to delete audio summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

export default new AudioAnalysisService();
