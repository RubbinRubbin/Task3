import type { AnalyzeResponse, GenerateResponse } from "./types";

const BASE_URL = "/api";

async function request<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok || json.success === false) {
    throw new Error(json.error?.message ?? `Request failed with status ${res.status}`);
  }

  return json as T;
}

export function analyzeReviews(reviews: string[]) {
  return request<AnalyzeResponse>("/analyze", { reviews });
}

export function generateReviews(count: number = 5) {
  return request<GenerateResponse>("/generate", { count });
}
