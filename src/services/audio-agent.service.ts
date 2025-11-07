import OpenAI from 'openai';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import type { AudioAnalysisResult } from '../types/audio/audio.types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AudioAgentService {
  /**
   * Transcribe audio using OpenAI Whisper
   */
  private async transcribeAudio(
    audioBuffer: Buffer,
    filename: string,
  ): Promise<string> {
    const tempDir = '/tmp';
    // Preserve the original file extension for Whisper API format detection
    const fileExtension = path.extname(filename) || '.m4a';
    const tempFilePath = path.join(tempDir, `temp-${Date.now()}${fileExtension}`);

    try {
      // Save buffer to temporary file for Whisper API
      await fs.writeFile(tempFilePath, audioBuffer);

      // Create a read stream for the file - use fsSync.createReadStream to preserve filename
      const fileStream = fsSync.createReadStream(tempFilePath);

      // Call Whisper API for transcription
      const transcription = await openai.audio.transcriptions.create({
        file: fileStream,
        model: 'whisper-1',
        language: 'es', // Spanish by default, can be made configurable
        response_format: 'text',
      });

      // Clean up temp file
      await fs.unlink(tempFilePath);

      return transcription as string;
    } catch (error) {
      // Clean up temp file on error
      try {
        await fs.unlink(tempFilePath);
      } catch {
        // Ignore cleanup errors
      }

      throw new Error(
        `Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Analyze transcript using GPT-4o-mini with structured output
   */
  private async analyzeTranscript(
    transcript: string,
    filename: string,
  ): Promise<AudioAnalysisResult> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert audio content analyzer. Analyze the provided transcript and extract:
1. A clear, descriptive title (max 100 characters)
2. 5-10 key topics and themes as keywords (single words or short phrases)
3. A comprehensive summary (3-5 sentences capturing main points)

Return your analysis in JSON format with this exact structure:
{
  "title": "descriptive title here",
  "keywords": ["keyword1", "keyword2", ...],
  "transcript": "the full original transcript",
  "summary": "comprehensive summary here"
}`,
        },
        {
          role: 'user',
          content: `Analyze this audio transcript from file "${filename}":\n\n${transcript}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from GPT model');
    }

    const analysis = JSON.parse(content) as AudioAnalysisResult;

    // Ensure transcript is included
    analysis.transcript = transcript;

    // Validate required fields
    if (!analysis.title || !analysis.keywords || !analysis.summary) {
      throw new Error('Analysis is missing required fields');
    }

    return analysis;
  }

  /**
   * Analyze audio file: transcribe with Whisper and analyze with GPT-4o-mini
   */
  async analyzeAudio(
    audioBuffer: Buffer,
    filename: string,
    userId: string,
  ): Promise<AudioAnalysisResult> {
    try {
      console.log(`Starting audio analysis for user ${userId}, file: ${filename}`);

      // Step 1: Transcribe audio with Whisper
      console.log('Transcribing audio with Whisper...');
      const transcript = await this.transcribeAudio(audioBuffer, filename);
      console.log(`Transcription complete. Length: ${transcript.length} characters`);

      // Step 2: Analyze transcript with GPT-4o-mini
      console.log('Analyzing transcript with GPT-4o-mini...');
      const analysis = await this.analyzeTranscript(transcript, filename);
      console.log('Analysis complete');

      return analysis;
    } catch (error) {
      console.error('Error analyzing audio:', error);
      throw new Error(
        `Failed to analyze audio: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

export default new AudioAgentService();
