import { zodResponseFormat } from "openai/helpers/zod";
import { getOpenAIClient } from "../lib/openai.js";
import { config } from "../lib/config.js";
import { withRetry } from "../lib/retry.js";
import { OpenAIError, ValidationError } from "../lib/errors.js";
import {
  SentimentBatchSchema,
  GeneratedReviewsSchema,
  type SentimentBatch,
  type GeneratedReviews,
} from "../schemas.js";

const ANALYSIS_SYSTEM_PROMPT = `Sei un esperto di analisi del sentimento specializzato in lingua italiana.
Per ogni recensione fornita, determina:
1. Il sentiment: "positivo", "negativo" o "neutro"
2. Una breve motivazione in italiano (1-2 frasi) che spiega il tuo ragionamento
3. Un punteggio di confidenza tra 0.0 e 1.0

Sii preciso e coerente. Considera contesto, sarcasmo e sfumature della lingua italiana.
Le recensioni riguardano delle cuffie wireless "SoundPro X1".`;

const GENERATION_SYSTEM_PROMPT = `Genera recensioni italiane realistiche per delle cuffie wireless premium "SoundPro X1 — Cuffie Wireless con Cancellazione del Rumore" al prezzo di €149.99.
Le recensioni devono essere varie: alcune positive, alcune negative, alcune neutre.
Ogni recensione deve sembrare scritta da un vero cliente italiano, con toni e stili diversi.
Copri aspetti come: qualità audio, comfort, batteria, cancellazione rumore, prezzo, design, Bluetooth, microfono.`;

export async function analyzeSentiments(reviews: string[]): Promise<{
  results: SentimentBatch;
  model: string;
}> {
  const client = getOpenAIClient();

  const userMessage = reviews
    .map((r, i) => `[Recensione ${i + 1}]: ${r}`)
    .join("\n\n");

  const response = await withRetry(() =>
    client.beta.chat.completions.parse({
      model: config.OPENAI_MODEL,
      messages: [
        { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: zodResponseFormat(SentimentBatchSchema, "sentiment_analysis"),
      temperature: 0.1,
    })
  );

  const message = response.choices[0]?.message;

  if (message?.refusal) {
    throw new OpenAIError(`Model refused the request: ${message.refusal}`);
  }

  if (!message?.parsed) {
    throw new OpenAIError("Failed to parse structured output from OpenAI");
  }

  if (message.parsed.results.length !== reviews.length) {
    throw new ValidationError(
      `Expected ${reviews.length} results, got ${message.parsed.results.length}`
    );
  }

  return {
    results: message.parsed,
    model: response.model,
  };
}

export async function generateReviews(count: number): Promise<{
  reviews: GeneratedReviews;
  model: string;
}> {
  const client = getOpenAIClient();

  const response = await withRetry(() =>
    client.beta.chat.completions.parse({
      model: config.OPENAI_MODEL,
      messages: [
        { role: "system", content: GENERATION_SYSTEM_PROMPT },
        { role: "user", content: `Genera esattamente ${count} recensioni diverse.` },
      ],
      response_format: zodResponseFormat(GeneratedReviewsSchema, "generated_reviews"),
      temperature: 0.9,
    })
  );

  const message = response.choices[0]?.message;

  if (message?.refusal) {
    throw new OpenAIError(`Model refused the request: ${message.refusal}`);
  }

  if (!message?.parsed) {
    throw new OpenAIError("Failed to parse structured output from OpenAI");
  }

  return {
    reviews: message.parsed,
    model: response.model,
  };
}
