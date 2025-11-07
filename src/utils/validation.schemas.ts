import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const signinSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be at most 100 characters'),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be at most 100 characters'),
});

export const projectIdSchema = z.object({
  id: z.string().uuid('Invalid project ID format'),
});

export const createSubscriptionSchema = z.object({
  planId: z.enum(['FREE', 'PRO'], {
    message: 'Invalid plan ID',
  }),
});

export const audioSummaryIdSchema = z.object({
  id: z.string().uuid('Invalid audio summary ID format'),
});

export const audioAnalysisSchema = z.object({
  title: z.string().describe('A descriptive title for the audio content'),
  keywords: z
    .array(z.string())
    .describe('Key topics and themes discussed in the audio'),
  transcript: z.string().describe('Full transcription of the audio'),
  summary: z.string().describe('Comprehensive summary of the audio content'),
});

export const AudioAnalysisOutput = z.object({
  title: z.string().describe('A clear, descriptive title for the audio content (max 100 characters)'),
  keywords: z.array(z.string()).describe('5-10 key topics and themes as keywords (single words or short phrases)'),
  transcript: z.string().describe('The full original transcript of the audio'),
  summary: z.string().describe('A comprehensive summary (3-5 sentences capturing main points)'),
});

export const TranscriptionOutput = z.object({
  transcript: z.string().describe('The transcribed text from the audio file'),
  filename: z.string().describe('The name of the transcribed audio file'),
});
