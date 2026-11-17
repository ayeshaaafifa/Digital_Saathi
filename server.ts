import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

type SupportedLanguage = 'en' | 'ur' | 'roman-ur';

interface ChatHistoryItem {
  role: 'user' | 'assistant';
  text: string;
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY_MISSING');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function isDailyQuotaExhausted(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes('PerDay') ||
    msg.includes('free_tier_requests') ||
    msg.includes('Please retry in')
  );
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      if (isDailyQuotaExhausted(error)) {
        throw error;
      }
      const msg = error instanceof Error ? error.message : String(error);
      const isTransient =
        msg.includes('503') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('429') ||
        msg.includes('RESOURCE_EXHAUSTED');
      if (!isTransient || attempt === maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
    }
  }
  throw lastError;
}

let hydrogenQuotaExhaustedUntil = 0;

async function generateWithTextModelFallback(
  ai: GoogleGenAI,
  buildRequest: (model: string) => Parameters<typeof ai.models.generateContent>[0],
) {
  if (Date.now() < hydrogenQuotaExhaustedUntil) {
    return await withRetry(() => ai.models.generateContent(buildRequest('gemini-3.1-flash-lite')));
  }
  try {
    return await withRetry(() => ai.models.generateContent(buildRequest('gemini-4-hydrogen')));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      if (isDailyQuotaExhausted(error)) {
        hydrogenQuotaExhaustedUntil = Date.now() + 5 * 60 * 1000;
      }
      return await withRetry(() => ai.models.generateContent(buildRequest('gemini-3.1-flash-lite')));
    }
    throw error;
  }
}

function formatGeminiError(error: unknown): { status: number; message: string } {
  console.error('[Digital Saathi Gemini Error]:', error);
  const raw = error instanceof Error ? error.message : String(error);
  if (raw === 'GEMINI_API_KEY_MISSING') {
    return {
      status: 503,
      message:
        'Gemini API key is not configured on the server. Please configure GEMINI_API_KEY in Settings > Secrets.',
    };
  }
  if (raw.includes('API_KEY_INVALID') || raw.includes('PERMISSION_DENIED') || raw.includes('403')) {
    return {
      status: 403,
      message:
        'Gemini API access was denied. Please check your GEMINI_API_KEY in the Settings > Secrets panel.',
    };
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
    return {
      status: 429,
      message: 'The AI service is currently busy. Please wait a few seconds and try again.',
    };
  }
  if (raw.includes('NOT_FOUND') || raw.includes('404')) {
    return {
      status: 502,
      message: 'The configured Gemini model could not be reached. Please try again shortly.',
    };
  }
  if (raw.includes('INVALID_ARGUMENT') || raw.includes('400')) {
    return {
      status: 400,
      message: 'The AI request could not be processed. Please try rephrasing your question.',
    };
  }
  if (error instanceof SyntaxError) {
    return {
      status: 502,
      message: 'Received an unexpected response format from the AI service. Please try again.',
    };
  }
  return {
    status: 500,
    message: 'Unable to reach Digital Saathi AI right now. Please try again in a moment.',
  };
}

function parseJsonSafely<T>(rawText: string): T {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
  return JSON.parse(cleaned) as T;
}

function getLanguageInstruction(language: SupportedLanguage): string {
  if (language === 'ur') {
    return 'Respond exclusively in clear, respectful, everyday Urdu script (اردو) suitable for elders and families. Keep sentences short and easy to read.';
  }
  if (language === 'roman-ur') {
    return 'Respond in clear, friendly, everyday Roman Urdu (for example: "Sab se pehle apnay phone ki Settings kholen..."). Keep sentences simple and welcoming.';
  }
  return 'Respond in warm, plain, respectful English suitable for elderly users, rural communities, and beginners.';
}

function detectMessageLanguage(message: string, fallback: SupportedLanguage): SupportedLanguage {
  if (/[\u0600-\u06FF]/.test(message)) {
    return 'ur';
  }
  const lower = message.toLowerCase();
  const romanUrduSignals = [
    'kaise',
    'kesay',
    'kya',
    'chahiye',
    'karna',
    'karen',
    'karun',
    'batao',
    'batayen',
    'bataiye',
    'mera',
    'meri',
    'apna',
    'apni',
    'hain',
    'nahi',
    'mein',
    'par',
    'se',
    'ko',
    'samjha',
    'bhejen',
    'bhej',
    'kholen',
    'madad',
    'paise',
  ];
  let matches = 0;
  for (const token of romanUrduSignals) {
    if (new RegExp(`\\b${token}\\b`, 'i').test(lower)) {
      matches++;
    }
  }
  if (matches >= 2) {
    return 'roman-ur';
  }
  return fallback;
}

function detectSensitiveCredentialRisk(message: string): boolean {
  const lower = message.toLowerCase();
  const patterns = [
    /\botp\b/i,
    /\bpin\b/i,
    /\bcvv\b/i,
    /\bcvc\b/i,
    /\bpassword\b/i,
    /\bpasscode\b/i,
    /\batm\b/i,
    /\bbank\s*(account|card|details|code|sms|call)\b/i,
    /\beasypaisa\b/i,
    /\bjazzcash\b/i,
    /\bcnic\b/i,
    /\biban\b/i,
    /\bmpin\b/i,
    /\btpin\b/i,
    /او\s*ٹی\s*پی/,
    /پاس\s*ورڈ/,
    /پن\s*کوڈ/,
    /بینک/,
    /اکاؤنٹ/,
    /اے\s*ٹی\s*ایم/,
    /شناختی\s*کارڈ/,
  ];
  return patterns.some((re) => re.test(lower));
}

function cleanStepText(step: string): string {
  return step.replace(/^\s*(step\s*\d+[:.)\-]|\d+[.)\-])\s*/i, '').trim();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '8mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    const key = process.env.GEMINI_API_KEY;
    res.json({
      ok: true,
      geminiConfigured: Boolean(key && key !== 'MY_GEMINI_API_KEY'),
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const body = req.body as {
        message?: string;
        language?: SupportedLanguage;
        history?: ChatHistoryItem[];
      };

      const message = typeof body.message === 'string' ? body.message.trim() : '';
      const uiLanguage: SupportedLanguage =
        body.language === 'ur' || body.language === 'roman-ur' ? body.language : 'en';

      if (!message) {
        res.status(400).json({ error: 'Please enter a question for Digital Saathi.' });
        return;
      }

      if (message.length > 1000) {
        res.status(400).json({ error: 'Question is too long. Please keep it under 1000 characters.' });
        return;
      }

      const detectedLanguage = detectMessageLanguage(message, uiLanguage);
      const hasSensitiveKeywords = detectSensitiveCredentialRisk(message);

      const historyItems = Array.isArray(body.history) ? body.history.slice(-6) : [];
      const historyContext =
        historyItems.length > 0
          ? historyItems
              .map((h) => `${h.role === 'user' ? 'User' : 'Digital Saathi'}: ${String(h.text).slice(0, 300)}`)
              .join('\n')
          : 'No prior conversation.';

      const ai = getGeminiClient();

      const systemInstruction = [
        'You are Digital Saathi ("Technology for Everyone"), a patient, encouraging, and respectful digital literacy teacher helping elderly people, rural community members, students, and beginners use technology safely and independently.',
        'LANGUAGE RULE: You fluently understand English, Urdu script (اردو), and Roman Urdu. Reply in the exact language of the user message, or if unclear use the active app language.',
        getLanguageInstruction(detectedLanguage),
        'TEACHING STYLE: Explain every solution in clear, calm, step-by-step instructions. Each item in `steps` must be ONE small physical or visual action (for example: "Tap the green WhatsApp icon on your screen", "Look at the top-right corner for three small dots"). Do not include "Step 1" or "1." inside the step text because the app numbers them automatically.',
        'PLAIN LANGUAGE RULE: Strictly avoid complicated technical jargon and acronyms (never say cache, cookie, SSL, DNS, protocol, authentication token, bandwidth, or APK without replacing them with simple everyday words like "website address", "temporary phone memory", or "unknown file").',
        'CRITICAL SAFETY RULE (OTPs, PASSWORDS & BANKING CREDENTIALS): Never ask the user to type or share their OTP, PIN, password, CVV, CNIC, or bank account number. If the user asks ANY question involving sharing, entering, verifying, sending, or giving away OTPs, passwords, PINs, ATM/bank card details, Easypaisa/JazzCash codes, or responding to a suspicious bank/prize message or caller: (1) set `isSafetyWarning` to true, (2) clearly and firmly warn them in `summary` and `safetyTip` NEVER to share OTPs, passwords, or banking details with anyone—not even someone claiming to be from a bank or government office, and (3) give safe numbered steps such as hanging up, blocking the caller, and calling only the official helpline printed on their bank card.',
      ].join(' ');

      const promptText = [
        `Active UI language: ${uiLanguage}. Detected message language: ${detectedLanguage}.`,
        hasSensitiveKeywords
          ? 'Note: The user message mentions OTPs, passwords, PINs, or banking credentials—evaluate carefully for safety and provide an explicit protective warning if any unsafe sharing or scam risk is involved.'
          : '',
        `Recent conversation:\n${historyContext}`,
        `Current question from user:\n${message}`,
      ]
        .filter(Boolean)
        .join('\n\n');

      const response = await generateWithTextModelFallback(ai, (model) => ({
        model,
        contents: promptText,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description:
                  'A warm, patient 1-2 sentence direct answer in plain everyday language (or a clear safety warning first if OTP/password/banking risk is present).',
              },
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  '2 to 6 clear, simple sequential steps in plain everyday language without numbering prefixes like "1.".',
              },
              safetyTip: {
                type: Type.STRING,
                description:
                  'A short practical safety reminder. Required whenever OTPs, passwords, PINs, links, or banking credentials are mentioned.',
              },
              isSafetyWarning: {
                type: Type.BOOLEAN,
                description:
                  'True if the user question involves unsafe sharing of OTPs, passwords, PINs, banking credentials, or potential scam/fraud risk; otherwise false.',
              },
              detectedLanguage: {
                type: Type.STRING,
                description: 'Must be exactly one of: "en", "ur", or "roman-ur".',
              },
              followUps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 or 3 short suggested follow-up questions in the reply language.',
              },
              spokenText: {
                type: Type.STRING,
                description:
                  'A short, natural, friendly spoken summary under 350 characters for read-aloud accessibility.',
              },
            },
            required: [
              'summary',
              'steps',
              'safetyTip',
              'isSafetyWarning',
              'detectedLanguage',
              'followUps',
              'spokenText',
            ],
          },
        },
      }));

      const rawText = (response.text ?? '').trim();
      const parsed = parseJsonSafely<{
        summary: string;
        steps: string[];
        safetyTip: string;
        isSafetyWarning?: boolean;
        detectedLanguage?: SupportedLanguage;
        followUps: string[];
        spokenText: string;
      }>(rawText);

      const replyLanguage: SupportedLanguage =
        parsed.detectedLanguage === 'ur' ||
        parsed.detectedLanguage === 'roman-ur' ||
        parsed.detectedLanguage === 'en'
          ? parsed.detectedLanguage
          : detectedLanguage;

      const cleanedSteps = Array.isArray(parsed.steps)
        ? parsed.steps.slice(0, 8).map((s) => cleanStepText(String(s))).filter(Boolean)
        : [];

      const isSafetyWarning = Boolean(parsed.isSafetyWarning) || hasSensitiveKeywords;

      res.json({
        summary: parsed.summary || '',
        steps: cleanedSteps,
        safetyTip: parsed.safetyTip || '',
        isSafetyWarning,
        detectedLanguage: replyLanguage,
        followUps: Array.isArray(parsed.followUps) ? parsed.followUps.slice(0, 3) : [],
        spokenText: parsed.spokenText || parsed.summary || '',
      });
    } catch (error: unknown) {
      const formatted = formatGeminiError(error);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  app.post('/api/analyze-screenshot', async (req: Request, res: Response) => {
    try {
      const body = req.body as {
        imageBase64?: string;
        mimeType?: string;
        language?: SupportedLanguage;
        note?: string;
      };

      const imageBase64 = typeof body.imageBase64 === 'string' ? body.imageBase64.trim() : '';
      const rawMime = typeof body.mimeType === 'string' ? body.mimeType.trim().toLowerCase() : '';
      const mimeType = rawMime === 'image/jpg' ? 'image/jpeg' : rawMime;
      const language: SupportedLanguage =
        body.language === 'ur' || body.language === 'roman-ur' ? body.language : 'en';
      const note = typeof body.note === 'string' ? body.note.trim().slice(0, 300) : '';

      const allowedMimeTypes = new Set(['image/png', 'image/jpeg']);
      if (!imageBase64 || !allowedMimeTypes.has(mimeType)) {
        res.status(400).json({
          error: 'Unsupported file format. Please upload a JPG, JPEG, or PNG screenshot.',
        });
        return;
      }

      if (!/^[A-Za-z0-9+/=]+$/.test(imageBase64.slice(0, 128))) {
        res.status(400).json({ error: 'The uploaded image data appears invalid. Please try another file.' });
        return;
      }

      if (imageBase64.length > 7_000_000) {
        res.status(400).json({ error: 'Screenshot file is too large. Please choose an image under 5 MB.' });
        return;
      }

      const ai = getGeminiClient();

      const systemInstruction = [
        'You are Digital Saathi Screenshot Helper, a patient digital literacy teacher helping elders, rural community members, students, and beginners understand phone or computer error screens.',
        getLanguageInstruction(language),
        'Identify any visible error message or popup clearly, explain what it means in plain everyday words without technical jargon, assess safety risk (safe, caution, or danger), give simple one-action troubleshooting steps (without numbering prefixes like "1."), and state clearly what NOT to do (such as never sharing OTPs, PINs, passwords, or clicking suspicious links).',
      ].join(' ');

      const userPrompt = note
        ? `Please look at this screenshot, identify the error or message shown, explain it simply, and give easy troubleshooting steps. User note: ${note}`
        : 'Please look at this screenshot, identify the error or message shown, explain what it means in simple words, tell me if it is safe or risky, and give easy troubleshooting steps.';

      const response = await generateWithTextModelFallback(ai, (model) => ({
        model,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: imageBase64,
              },
            },
            { text: userPrompt },
          ],
        },
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'Short, clear title describing what is shown on the screen.',
              },
              detectedError: {
                type: Type.STRING,
                description:
                  'Exact short error code or key message detected on the screen, or a brief description if no error code appears.',
              },
              explanation: {
                type: Type.STRING,
                description: 'Plain-language explanation of what this screen or error means without jargon.',
              },
              riskLevel: {
                type: Type.STRING,
                description:
                  'Must be exactly one of: "safe", "caution", or "danger". safe = routine setting/connection issue; caution = permission/update prompt; danger = scam, phishing, fake prize, OTP request, or malware risk.',
              },
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 6 safe, simple troubleshooting steps without numbering prefixes.',
              },
              doNotDo: {
                type: Type.STRING,
                description: 'One clear sentence about what NOT to do or share.',
              },
              spokenText: {
                type: Type.STRING,
                description: 'Short spoken summary under 350 characters for read-aloud accessibility.',
              },
            },
            required: [
              'title',
              'detectedError',
              'explanation',
              'riskLevel',
              'steps',
              'doNotDo',
              'spokenText',
            ],
          },
        },
      }));

      const parsed = parseJsonSafely<{
        title: string;
        detectedError?: string;
        explanation: string;
        riskLevel: 'safe' | 'caution' | 'danger';
        steps: string[];
        doNotDo: string;
        spokenText: string;
      }>((response.text ?? '').trim());

      const cleanedSteps = Array.isArray(parsed.steps)
        ? parsed.steps.slice(0, 6).map((s) => cleanStepText(String(s))).filter(Boolean)
        : [];

      res.json({
        title: parsed.title || 'Screen Analysis',
        detectedError: parsed.detectedError || '',
        explanation: parsed.explanation || '',
        riskLevel:
          parsed.riskLevel === 'danger' || parsed.riskLevel === 'caution' ? parsed.riskLevel : 'safe',
        steps: cleanedSteps,
        doNotDo: parsed.doNotDo || '',
        spokenText: parsed.spokenText || parsed.explanation || '',
      });
    } catch (error: unknown) {
      const formatted = formatGeminiError(error);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  app.post('/api/tts', async (req: Request, res: Response) => {
    try {
      const body = req.body as { text?: string; language?: SupportedLanguage };
      const text = typeof body.text === 'string' ? body.text.trim().slice(0, 600) : '';
      const language: SupportedLanguage =
        body.language === 'ur' || body.language === 'roman-ur' ? body.language : 'en';

      if (!text) {
        res.status(400).json({ error: 'Text is required for speech generation.' });
        return;
      }

      const ai = getGeminiClient();
      const styleHint =
        language === 'ur'
          ? 'Warm, calm, clear Urdu-accented helpful companion speaking slowly and respectfully'
          : 'Warm, calm, patient helpful companion speaking clearly at an unhurried pace';

      const ttsRequest = {
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text,
                speechMetadata: {
                  style: styleHint,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      };

      let response;
      try {
        response = await withRetry(() => ai.models.generateContent(ttsRequest));
      } catch (ttsErr: unknown) {
        const msg = ttsErr instanceof Error ? ttsErr.message : String(ttsErr);
        if (msg.includes('speechMetadata') || msg.includes('speechConfig')) {
          const alphaAi = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            apiVersion: 'v1alpha',
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
          });
          response = await withRetry(() => alphaAi.models.generateContent(ttsRequest));
        } else {
          throw ttsErr;
        }
      }

      const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!audioBase64) {
        res.status(502).json({ error: 'Speech audio was not returned by the model.' });
        return;
      }

      res.json({
        audioBase64,
        mimeType: 'audio/wav',
      });
    } catch (error: unknown) {
      const formatted = formatGeminiError(error);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  app.use('/api', (err: unknown, _req: Request, res: Response, _next: express.NextFunction) => {
    const e = err as { type?: string; status?: number; message?: string };
    if (e?.type === 'entity.too.large' || e?.status === 413) {
      res.status(413).json({
        error: 'Uploaded file is too large. Please choose a JPG or PNG image under 5 MB.',
      });
      return;
    }
    if (e?.type === 'entity.parse.failed' || err instanceof SyntaxError) {
      res.status(400).json({
        error: 'Invalid request payload. Please try again.',
      });
      return;
    }
    res.status(500).json({
      error: 'An unexpected server error occurred. Please try again.',
    });
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital Saathi server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Digital Saathi server:', err);
  process.exit(1);
});
