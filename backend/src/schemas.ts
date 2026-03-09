import { z } from "zod";

// --- Sentiment enum ---
export const SentimentEnum = z.enum(["positivo", "negativo", "neutro"]);
export type Sentiment = z.infer<typeof SentimentEnum>;

// --- Single review analysis result ---
export const SentimentResultSchema = z.object({
  review: z.string().describe("The original review text"),
  sentiment: SentimentEnum.describe("The detected sentiment: positivo, negativo, or neutro"),
  motivation: z.string().describe("Brief explanation in Italian of why this sentiment was assigned (1-2 sentences)"),
  confidence: z.number().min(0).max(1).describe("Confidence score between 0.0 and 1.0"),
});
export type SentimentResult = z.infer<typeof SentimentResultSchema>;

// --- Batch analysis response from OpenAI ---
export const SentimentBatchSchema = z.object({
  results: z.array(SentimentResultSchema),
});
export type SentimentBatch = z.infer<typeof SentimentBatchSchema>;

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
