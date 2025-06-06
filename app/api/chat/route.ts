import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

export const slideSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  slideNumber: z.string(), // Format like "01", "02", etc.
  code: z.string(),
});

export async function POST(req: Request) {
  const context = await req.json();

  const result = await generateObject({
    model: openai('openai', {
      structuredOutputs: true,
    }),
    schemaName: 'slides',
    schemaDescription: 'A collection of JavaScript code slides for learning.',
    schema: z.object({
      slides: z.array(slideSchema),
    }),
    prompt: context,
  });

  return new Response(
    JSON.stringify({
      slides: result.object.slides,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
