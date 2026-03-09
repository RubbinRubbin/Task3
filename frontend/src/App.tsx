import { ProductHero } from "./components/ProductHero";
import { ReviewSection } from "./components/ReviewSection";
import { defaultReviews } from "./data/reviews";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-900" />
          <span className="text-sm font-semibold text-slate-900 tracking-tight">SentimentAI</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <ProductHero />
        <ReviewSection initialReviews={defaultReviews} />
      </main>

      <footer className="border-t border-slate-100 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-5 text-xs text-slate-400">
          Prodotto e recensioni fittizi — demo di analisi del sentimento
        </div>
      </footer>
    </div>
  );
}

export default App;
