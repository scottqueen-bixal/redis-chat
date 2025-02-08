import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';
import type { RequestEvent } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';


const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY ?? '',
});

export const POST = (async ({ request } : RequestEvent) => {
  const { messages } = await request.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;
