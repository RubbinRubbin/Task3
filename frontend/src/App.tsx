import { ProductHero } from "./components/ProductHero";
import { ReviewSection } from "./components/ReviewSection";
import { defaultReviews } from "./data/reviews";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900">Sentiment Analyzer</span>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            Powered by OpenAI
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <ProductHero />
        <ReviewSection initialReviews={defaultReviews} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-xs text-slate-400">
          Sentiment Analysis Demo &mdash; Le recensioni e il prodotto sono fittizi.
        </div>
      </footer>
    </div>
  );
}

export default App;
