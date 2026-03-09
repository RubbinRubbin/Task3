import type { SentimentResult, Review } from "../types";

const sentimentConfig = {
  positivo: {
    label: "Positivo",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bar: "bg-emerald-500",
    ring: "ring-emerald-100",
  },
  negativo: {
    label: "Negativo",
    dot: "bg-red-500",
    text: "text-red-600",
    bar: "bg-red-500",
    ring: "ring-red-100",
  },
  neutro: {
    label: "Neutro",
    dot: "bg-slate-400",
    text: "text-slate-500",
    bar: "bg-slate-400",
    ring: "ring-slate-100",
  },
};

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

interface Props {
  result: SentimentResult;
  review: Review;
}

export function SentimentCard({ result, review }: Props) {
  const cfg = sentimentConfig[result.sentiment];
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-slate-200 transition-colors">
      {/* Author row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500">
            {review.author.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 leading-none">{review.author}</p>
            <div className="mt-0.5">
              <Stars count={review.stars} />
            </div>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-semibold ${cfg.text}`}>
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      {/* Review text */}
      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Motivation */}
      <p className="text-xs text-slate-400 leading-relaxed mb-3 italic">
        {result.motivation}
      </p>

      {/* Confidence bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 w-16">Confidenza</span>
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${cfg.bar} rounded-full transition-all duration-500`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
        <span className="text-xs font-medium text-slate-500 w-8 text-right">
          {confidencePercent}%
        </span>
      </div>
    </div>
  );
}
