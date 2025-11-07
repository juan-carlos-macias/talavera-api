import { Agent, run } from '@openai/agents';
import type { AudioAnalysisContext, AudioAnalysisResult } from '../types/audio/audio.types';
import audioTranscriptionAgent from './audio-transcription-agent.service';
import { ApiError } from '../utils/errors';
import httpStatus from 'http-status';
import { AudioAnalysisOutput } from '../utils/validation.schemas';
import { AUDIO_AGENT_INSTRUCTION_PROMPT, AGENT_NAME, AUDIO_AGENT_PROMPT } from '../constants/audio.constants';
import { OpenAIModels } from '../constants/openAI.constants';

class AudioAgentService {
  private agent: Agent<AudioAnalysisContext, typeof AudioAnalysisOutput>;

  constructor() {
    this.agent = new Agent<AudioAnalysisContext, typeof AudioAnalysisOutput>({
      name: AGENT_NAME,
      instructions: (runContext) => {
        const { filename } = runContext.context;
        return AUDIO_AGENT_INSTRUCTION_PROMPT(filename);
      },
      outputType: AudioAnalysisOutput,
      model: OpenAIModels.GPT4oMini,
      tools: [],
    });
  }

 
  async analyzeAudio(
    audioBuffer: Buffer,
    filename: string,
    userId: string,
  ): Promise<AudioAnalysisResult> {
    try {

      const transcriptionTool = audioTranscriptionAgent.asTool(filename);

      const agentWithTools = this.agent.clone({
        tools: [transcriptionTool],
      });

      const result = await run(
        agentWithTools,
        AUDIO_AGENT_PROMPT(filename),
        {
          context: {
            audioBuffer,
            filename,
            userId,
          },
        },
      );

      if (!result.finalOutput) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'No output from agent',
        );
      }

      const analysis = result.finalOutput as AudioAnalysisResult;

      if (!analysis.title || !analysis.keywords || !analysis.summary || !analysis.transcript) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Analysis is missing required fields (title, keywords, summary, or transcript)',
        );
      }

      return analysis;
    } catch (error) {

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to analyze audio: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

export default new AudioAgentService();
