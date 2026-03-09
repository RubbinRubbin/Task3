import type { SentimentResult } from "../types";

const sentimentConfig = {
  positivo: {
    label: "Positivo",
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  negativo: {
    label: "Negativo",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700 border-red-200",
    bar: "bg-red-500",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  neutro: {
    label: "Neutro",
    bg: "bg-slate-50",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    bar: "bg-slate-400",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export function SentimentCard({ result, index }: { result: SentimentResult; index: number }) {
  const config = sentimentConfig[result.sentiment];
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className={`${config.bg} rounded-xl p-5 border border-slate-100 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-slate-800 text-sm leading-relaxed italic flex-1">
          <span className="text-slate-400 font-medium not-italic mr-1">#{index + 1}</span>
          &ldquo;{result.review}&rdquo;
        </p>
        <span className={`${config.badge} border text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0`}>
          {config.icon}
          {config.label}
        </span>
      </div>

      <p className="text-slate-600 text-sm mb-3">
        <span className="font-medium text-slate-700">Motivazione:</span> {result.motivation}
      </p>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 font-medium w-20">Confidenza</span>
        <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
          <div
            className={`h-full ${config.bar} rounded-full transition-all duration-500`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-slate-600 w-10 text-right">
          {confidencePercent}%
        </span>
      </div>
    </div>
  );
}
