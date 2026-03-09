import { product } from "../data/product";

export function ProductHero() {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-5/12 bg-slate-50 flex items-center justify-center p-10">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-[260px] h-auto object-contain rounded-xl"
          />
        </div>

        {/* Info */}
        <div className="md:w-7/12 p-7 flex flex-col gap-5">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">Cuffie Premium</p>
            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
            <p className="text-slate-500 text-sm mt-1">{product.subtitle}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
            <span className="text-sm text-slate-400">&middot; {product.reviewCount.toLocaleString("it-IT")} recensioni</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">€{product.price.toFixed(2)}</span>
            <span className="text-base text-slate-300 line-through">€{product.originalPrice.toFixed(2)}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-500 leading-relaxed">{product.description}</p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {product.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-300">—</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
