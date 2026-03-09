import { z } from "zod";

// --- Sentiment enum ---
export const SentimentEnum = z.enum(["positivo", "negativo", "neutro"]);
export type Sentiment = z.infer<typeof SentimentEnum>;

// --- Aggregate sentiment analysis result ---
export const AggregateAnalysisSchema = z.object({
  sentiment: SentimentEnum.describe("The overall sentiment across all reviews: positivo, negativo, or neutro"),
  motivation: z.string().describe("A brief description in Italian (2-3 sentences) explaining the overall sentiment, summarizing the main themes and opinions expressed by customers"),
  confidence: z.number().min(0).max(1).describe("Confidence score between 0.0 and 1.0 for the overall assessment"),
});
export type AggregateAnalysis = z.infer<typeof AggregateAnalysisSchema>;

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
