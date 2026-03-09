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

  const stats = [
    { label: "Positive", count: positive, pct: Math.round((positive / total) * 100), color: "bg-emerald-500", textColor: "text-emerald-600" },
    { label: "Negative", count: negative, pct: Math.round((negative / total) * 100), color: "bg-red-400", textColor: "text-red-500" },
    { label: "Neutre",   count: neutral,  pct: Math.round((neutral  / total) * 100), color: "bg-slate-300", textColor: "text-slate-500" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-slate-800">Risultati analisi</h3>
        <span className="text-xs text-slate-400">{total} recensioni &middot; {(meta.processingTimeMs / 1000).toFixed(1)}s</span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-2 rounded-full overflow-hidden mb-5 gap-0.5">
        {stats.map((s) => s.pct > 0 && (
          <div
            key={s.label}
            className={`h-full ${s.color} transition-all duration-700`}
            style={{ width: `${s.pct}%` }}
          />
        ))}
      </div>

      <div className="flex gap-6">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className={`text-xl font-bold ${s.textColor}`}>{s.pct}%</span>
            <span className="text-xs text-slate-400">{s.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xl font-bold text-slate-700">{Math.round(avgConfidence * 100)}%</span>
          <span className="text-xs text-slate-400">confidenza media</span>
        </div>
      </div>
    </div>
  );
}
