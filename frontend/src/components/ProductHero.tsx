import { product } from "../data/product";

export function ProductHero() {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="md:w-1/3 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-[280px] h-auto object-contain rounded-xl"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-2/3 p-6 md:p-8 flex flex-col gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{product.name}</h1>
            <p className="text-slate-500 mt-1">{product.subtitle}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(product.rating) ? "text-amber-400" : "text-slate-200"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-slate-700">{product.rating}</span>
            <span className="text-sm text-slate-400">({product.reviewCount.toLocaleString("it-IT")} recensioni)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">
              €{product.price.toFixed(2)}
            </span>
            <span className="text-lg text-slate-400 line-through">
              €{product.originalPrice.toFixed(2)}
            </span>
            <span className="bg-red-100 text-red-700 text-sm font-semibold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {product.features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
