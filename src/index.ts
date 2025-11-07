import dotenv from "dotenv";
dotenv.config();

import { setDefaultOpenAIKey } from '@openai/agents';
import { App } from "./app";

// Initialize OpenAI SDK with API key
const openaiKey = process.env.OPENAI_API_KEY;
if (!openaiKey) {
  console.error('OPENAI_API_KEY environment variable is not set');
  process.exit(1);
}

setDefaultOpenAIKey(openaiKey);
console.log('OpenAI SDK initialized successfully');

const server = new App();
server.listen();
