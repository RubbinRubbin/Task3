import { useState } from "react";
import type { SentimentResult, Sentiment } from "../types";
import { analyzeReviews, generateReviews } from "../api";
import { SentimentCard } from "./SentimentCard";
import { SentimentSummary } from "./SentimentSummary";
import { LoadingSpinner } from "./LoadingSpinner";

interface Props {
  initialReviews: string[];
}

type AnalysisState =
  | { status: "idle" }
  | { status: "analyzing" }
  | { status: "generating" }
  | { status: "success"; results: SentimentResult[]; meta: { model: string; processingTimeMs: number } }
  | { status: "error"; message: string };

type FilterType = "all" | Sentiment;

export function ReviewSection({ initialReviews }: Props) {
  const [reviews, setReviews] = useState<string[]>(initialReviews);
  const [state, setState] = useState<AnalysisState>({ status: "idle" });
  const [filter, setFilter] = useState<FilterType>("all");

  const isLoading = state.status === "analyzing" || state.status === "generating";

  async function handleAnalyze() {
    setState({ status: "analyzing" });
    try {
      const response = await analyzeReviews(reviews);
      setState({
        status: "success",
        results: response.data.results,
        meta: response.meta,
      });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Errore durante l'analisi",
      });
    }
  }

  async function handleGenerate() {
    setState({ status: "generating" });
    try {
      const response = await generateReviews(5);
      const newReviews = [...reviews, ...response.data.reviews];
      setReviews(newReviews);
      setState({ status: "idle" });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Errore durante la generazione",
      });
    }
  }

  const filteredResults =
    state.status === "success"
      ? filter === "all"
        ? state.results
        : state.results.filter((r) => r.sentiment === filter)
      : [];

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: "all", label: "Tutti" },
    { key: "positivo", label: "Positivi" },
    { key: "negativo", label: "Negativi" },
    { key: "neutro", label: "Neutri" },
  ];

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Recensioni ({reviews.length})
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Analizza il sentimento delle recensioni con AI
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.status === "generating" ? "Generazione..." : "+ Genera nuove"}
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {state.status === "analyzing" ? "Analisi in corso..." : "Analizza tutte"}
          </button>
        </div>
      </div>

      {/* Error */}
      {state.status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-800">Errore</p>
            <p className="text-sm text-red-600 mt-0.5">{state.message}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {state.status === "analyzing" && <LoadingSpinner message="OpenAI sta analizzando le recensioni..." />}
      {state.status === "generating" && <LoadingSpinner message="OpenAI sta generando nuove recensioni..." />}

      {/* Results */}
      {state.status === "success" && (
        <>
          <SentimentSummary results={state.results} meta={state.meta} />

          {/* Filters */}
          <div className="flex gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                  filter === btn.key
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredResults.map((result, i) => (
              <SentimentCard key={`${result.review}-${i}`} result={result} index={i} />
            ))}
          </div>
        </>
      )}

      {/* Idle: show raw reviews */}
      {state.status === "idle" && (
        <div className="grid gap-2">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-xl p-4 text-sm text-slate-600"
            >
              <span className="text-slate-400 font-medium mr-2">#{i + 1}</span>
              {review}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
