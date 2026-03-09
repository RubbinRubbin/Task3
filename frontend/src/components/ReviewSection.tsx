import { useState } from "react";
import type { Review, SentimentResult } from "../types";
import { analyzeReviews, generateReviews } from "../api";
import { LoadingSpinner } from "./LoadingSpinner";
import { SentimentCard } from "./SentimentCard";

interface Props {
  initialReviews: Review[];
}

type AnalysisState =
  | { status: "idle" }
  | { status: "analyzing" }
  | { status: "generating" }
  | { status: "success"; results: SentimentResult[]; meta: { model: string; processingTimeMs: number; reviewCount: number } }
  | { status: "error"; message: string };

const GENERATED_NAMES = [
  "Tommaso Galli", "Beatrice Longo", "Riccardo Poli", "Angela Mele", "Vincenzo Sala",
  "Elisa Caputo", "Giacomo Serra", "Nadia Palma", "Bruno Fabbri", "Concetta Villa",
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= count ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewSection({ initialReviews }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [state, setState] = useState<AnalysisState>({ status: "idle" });

  const isLoading = state.status === "analyzing" || state.status === "generating";

  async function handleAnalyze() {
    setState({ status: "analyzing" });
    try {
      const response = await analyzeReviews(reviews.map((r) => r.text));
      setState({ status: "success", results: response.data, meta: response.meta });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Errore durante l'analisi" });
    }
  }

  async function handleGenerate() {
    setState({ status: "generating" });
    try {
      const response = await generateReviews(5);
      const newReviews: Review[] = response.data.reviews.map((text, i) => ({
        text,
        author: GENERATED_NAMES[(reviews.length + i) % GENERATED_NAMES.length],
        stars: [1, 2, 3, 4, 5][Math.floor(Math.random() * 5)],
      }));
      setReviews((prev) => [...prev, ...newReviews]);
      setState({ status: "idle" });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Errore durante la generazione" });
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Recensioni dei clienti
          <span className="ml-2 text-sm font-normal text-slate-400">({reviews.length})</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {state.status === "generating" ? "Generazione..." : "+ Genera nuove"}
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {state.status === "analyzing" ? "Analisi..." : "Analizza tutte"}
          </button>
        </div>
      </div>

      {/* Error */}
      {state.status === "error" && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
          {state.message}
        </div>
      )}

      {/* Loading */}
      {(state.status === "analyzing" || state.status === "generating") && (
        <LoadingSpinner message={state.status === "analyzing" ? "Analisi in corso..." : "Generazione recensioni..."} />
      )}

      {/* Per-review results */}
      {state.status === "success" && (
        <>
          <div className="text-xs text-slate-400 text-right">
            {state.meta.reviewCount} recensioni &middot; {(state.meta.processingTimeMs / 1000).toFixed(1)}s
          </div>
          <div className="space-y-3">
            {state.results.map((result, i) => (
              <SentimentCard key={i} result={result} review={reviews[i]} />
            ))}
          </div>
        </>
      )}

      {/* Reviews list (shown only before analysis) */}
      {state.status !== "success" && (
        <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {reviews.map((review, i) => (
            <div key={i} className="px-5 py-4 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500 shrink-0">
                {review.author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-800">{review.author}</span>
                  <Stars count={review.stars} />
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{review.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
