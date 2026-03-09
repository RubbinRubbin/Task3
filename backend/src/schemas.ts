import { z } from "zod";

// --- Sentiment enum ---
export const SentimentEnum = z.enum(["positivo", "negativo", "neutro"]);
export type Sentiment = z.infer<typeof SentimentEnum>;

// --- Per-review sentiment analysis result ---
export const ReviewSentimentSchema = z.object({
  sentiment: SentimentEnum.describe("Sentiment della singola recensione: positivo, negativo, o neutro"),
  motivation: z.string().describe("Breve motivazione in italiano (1 frase) che spiega il sentiment assegnato"),
  confidence: z.number().min(0).max(1).describe("Confidenza tra 0.0 e 1.0 sulla certezza della classificazione"),
});
export type ReviewSentiment = z.infer<typeof ReviewSentimentSchema>;

export const ReviewAnalysisArraySchema = z.object({
  results: z.array(ReviewSentimentSchema).describe("Array di risultati, uno per ogni recensione, nello stesso ordine ricevuto"),
});
export type ReviewAnalysisArray = z.infer<typeof ReviewAnalysisArraySchema>;

// --- Generated reviews from OpenAI ---
export const GeneratedReviewsSchema = z.object({
  reviews: z.array(z.string().describe("A realistic Italian review about the product")),
});
export type GeneratedReviews = z.infer<typeof GeneratedReviewsSchema>;

// --- API request schemas ---
export const AnalyzeRequestSchema = z.object({
  reviews: z.array(z.string().min(1).max(5000)).min(1).max(50),
});

export const GenerateRequestSchema = z.object({
  count: z.number().min(1).max(20).default(5),
});
