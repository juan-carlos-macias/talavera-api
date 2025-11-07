import { Agent } from '@openai/agents';
import openAIService from './openai.service';
import { TranscriptionOutput } from '../utils/validation.schemas';
import { TranscriptionContext } from '../types/audio/audio.types';
import { AUDIO_TRANSCRIPTION_TOOL_DESCRIPTION, AGENT_AS_TOOL_NAME, TOOL_NAME, TOOL_DESCRIPTION } from '../constants/audio.constants';
import { OpenAIModels } from '../constants/openAI.constants';

class AudioTranscriptionAgent {
  private agent: Agent<TranscriptionContext, typeof TranscriptionOutput>;

  constructor() {
    this.agent = new Agent<TranscriptionContext, typeof TranscriptionOutput>({
      name: AGENT_AS_TOOL_NAME,
      instructions: async (runContext) => {
        const { audioBuffer, filename } = runContext.context;
        
        const transcript = await openAIService.transcribeAudio(audioBuffer, filename);
        
        return AUDIO_TRANSCRIPTION_TOOL_DESCRIPTION(filename, transcript);
      },
      outputType: TranscriptionOutput,
      model: OpenAIModels.GPT4oMini,
    });
  }

  asTool(filename: string) {
    return this.agent.asTool({
      toolName: TOOL_NAME,
      toolDescription: TOOL_DESCRIPTION(filename),
    });
  }
}

export default new AudioTranscriptionAgent();
