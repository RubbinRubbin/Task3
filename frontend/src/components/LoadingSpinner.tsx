export function LoadingSpinner({ message = "Analisi in corso..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm animate-pulse">{message}</p>
    </div>
  );
}
