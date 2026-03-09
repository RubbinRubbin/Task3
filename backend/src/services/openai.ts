import { zodResponseFormat } from "openai/helpers/zod";
import { getOpenAIClient } from "../lib/openai.js";
import { config } from "../lib/config.js";
import { withRetry } from "../lib/retry.js";
import { OpenAIError } from "../lib/errors.js";
import {
  AggregateAnalysisSchema,
  GeneratedReviewsSchema,
  type AggregateAnalysis,
  type GeneratedReviews,
} from "../schemas.js";

const ANALYSIS_SYSTEM_PROMPT = `Sei un esperto di analisi del sentimento specializzato in lingua italiana.
Analizza TUTTE le recensioni fornite nel loro insieme e determina:
1. Il sentiment GENERALE complessivo: "positivo", "negativo" o "neutro"
2. Una breve motivazione in italiano (2-3 frasi) che descrive il sentiment generale, riassumendo i temi principali e le opinioni espresse dai clienti
3. Un punteggio di confidenza tra 0.0 e 1.0 per la valutazione complessiva

Sii preciso e coerente. Considera il quadro generale, non le singole recensioni.
Le recensioni riguardano delle cuffie wireless "SoundPro X1".`;

const GENERATION_SYSTEM_PROMPT = `Genera recensioni italiane realistiche per delle cuffie wireless premium "SoundPro X1 — Cuffie Wireless con Cancellazione del Rumore" al prezzo di €149.99.
Le recensioni devono essere varie: alcune positive, alcune negative, alcune neutre.
Ogni recensione deve sembrare scritta da un vero cliente italiano, con toni e stili diversi.
Copri aspetti come: qualità audio, comfort, batteria, cancellazione rumore, prezzo, design, Bluetooth, microfono.`;

export async function analyzeSentiments(reviews: string[]): Promise<{
  result: AggregateAnalysis;
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
        { role: "user", content: `Analizza il sentiment complessivo di queste ${reviews.length} recensioni:\n\n${userMessage}` },
      ],
      response_format: zodResponseFormat(AggregateAnalysisSchema, "sentiment_analysis"),
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

  return {
    result: message.parsed,
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
