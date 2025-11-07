export const AUDIO_AGENT_INSTRUCTION_PROMPT = (filename: string) => `You are an expert audio content analyzer. Analyze the audio file "${filename}" by following these steps:

1. First, use the transcribe_audio tool to get the transcript of the audio
2. Then, analyze the transcript thoroughly and extract:
   - A clear, descriptive title (max 100 characters)
   - 5-10 key topics and themes as keywords (single words or short phrases)
   - The full original transcript
   - A comprehensive summary (3-5 sentences capturing main points)

Return your analysis in the structured format with all required fields.`;

export const AGENT_NAME = 'Audio Content Analyzer';

export const AUDIO_AGENT_PROMPT = (filename: string) => `Please transcribe and analyze the audio file "${filename}". Provide a complete analysis with title, keywords, transcript, and summary.`;

export const AUDIO_TRANSCRIPTION_TOOL_NAME = 'transcribe_audio';

export const AUDIO_TRANSCRIPTION_TOOL_DESCRIPTION = (filename: string, transcript: string) => `You have successfully transcribed the audio file "${filename}". 
        
The transcript is:
${transcript}

Please return this information in the structured format with the transcript and filename.`;

export const AGENT_AS_TOOL_NAME = 'Audio Transcription Specialist';

export const TOOL_NAME = 'transcribe_audio';

export const TOOL_DESCRIPTION = (filename:string) => `Transcribe the audio file "${filename}" to text using OpenAI Whisper. Use this tool when you need the transcript to analyze the audio content.`;