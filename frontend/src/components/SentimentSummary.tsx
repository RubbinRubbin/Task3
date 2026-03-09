import type { SentimentResult } from "../types";

interface Props {
  results: SentimentResult[];
  meta: { model: string; processingTimeMs: number };
}

export function SentimentSummary({ results, meta }: Props) {
  const total = results.length;
  const positive = results.filter((r) => r.sentiment === "positivo").length;
  const negative = results.filter((r) => r.sentiment === "negativo").length;
  const neutral = results.filter((r) => r.sentiment === "neutro").length;

  const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / total;

  const bars = [
    { label: "Positivo", count: positive, pct: Math.round((positive / total) * 100), color: "bg-emerald-500", textColor: "text-emerald-700" },
    { label: "Negativo", count: negative, pct: Math.round((negative / total) * 100), color: "bg-red-500", textColor: "text-red-700" },
    { label: "Neutro", count: neutral, pct: Math.round((neutral / total) * 100), color: "bg-slate-400", textColor: "text-slate-600" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Riepilogo Analisi</h2>

      <div className="space-y-3 mb-5">
        {bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-3">
            <span className={`text-sm font-medium w-20 ${bar.textColor}`}>{bar.label}</span>
            <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${bar.color} rounded-full transition-all duration-700`}
                style={{ width: `${bar.pct}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-700 w-16 text-right">
              {bar.count} ({bar.pct}%)
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-3 border-t border-slate-100">
        <span>{total} recensioni analizzate</span>
        <span>Confidenza media: {Math.round(avgConfidence * 100)}%</span>
        <span>Tempo: {(meta.processingTimeMs / 1000).toFixed(1)}s</span>
        <span>Modello: {meta.model}</span>
      </div>
    </div>
  );
}
