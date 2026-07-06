export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 px-3 py-2 text-sm">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="bg-white border border-slate-300 rounded-md px-2.5 sm:px-3 py-1.5 disabled:opacity-40 hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap"
      >
        Previous
      </button>
      <span className="text-slate-600 font-medium whitespace-nowrap">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="bg-white border border-slate-300 rounded-md px-2.5 sm:px-3 py-1.5 disabled:opacity-40 hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap"
      >
        Next
      </button>
    </div>
  );
}
