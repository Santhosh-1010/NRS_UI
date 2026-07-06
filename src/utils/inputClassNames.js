export function inputClassNames(hasError, { transition = false } = {}) {
  const base = `w-full border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:border-blue-500${transition ? ' transition-shadow' : ''}`;
  return hasError ? `${base} border-red-400 focus:ring-red-400` : `${base} border-slate-300 focus:ring-blue-500`;
}
