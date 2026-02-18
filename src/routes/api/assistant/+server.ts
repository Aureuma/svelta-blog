import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CV_GEMINI_API_KEY, CV_GEMINI_MODEL_NAME } from '$server/env';

const getGeminiUrl = () => {
  if (!CV_GEMINI_MODEL_NAME || !CV_GEMINI_API_KEY) {
    return null;
  }
  return `https://generativelanguage.googleapis.com/v1beta/models/${CV_GEMINI_MODEL_NAME}:generateContent?key=${CV_GEMINI_API_KEY}`;
};

const extractText = (payload: {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}) => {
  const parts = payload.candidates?.[0]?.content?.parts || [];
  return parts
    .map((part) => part.text || '')
    .join('\n')
    .trim();
};

export const POST: RequestHandler = async ({ request }) => {
  const url = getGeminiUrl();
  if (!url) {
    return json(
      { message: 'LLM not configured (missing CV_GEMINI_* env vars).' },
      { status: 503 }
    );
  }

  const body = await request.json();
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';

  if (!prompt) {
    return json(
      { message: 'Describe your business to get a draft.' },
      { status: 400 }
    );
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: 'You are Convelt, an AI website concierge for small businesses. Provide a 2-3 sentence homepage draft summary with a confident, warm tone.'
          }
        ]
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Business brief: ${prompt}. Return just the summary text.`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        maxOutputTokens: 220
      }
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    return json({ message: detail }, { status: 500 });
  }

  const payload = await response.json();
  const summary = extractText(payload);

  return json({ summary });
};
