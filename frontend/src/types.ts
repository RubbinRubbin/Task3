export type Sentiment = "positivo" | "negativo" | "neutro";

export interface Review {
  text: string;
  author: string;
  stars: number;
}

export interface AggregateResult {
  sentiment: Sentiment;
  motivation: string;
  confidence: number;
}

export interface AnalyzeResponse {
  success: true;
  data: AggregateResult;
  meta: {
    model: string;
    processingTimeMs: number;
    reviewCount: number;
  };
}

export interface GenerateResponse {
  success: true;
  data: { reviews: string[] };
  meta: {
    model: string;
    processingTimeMs: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: { code: string; message: string };
}

export type ApiResponse<T> = T | ErrorResponse;
