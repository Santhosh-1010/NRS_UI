import Button from './Button';

const PAGE_BUTTON_CLASS = 'bg-white border border-slate-300 disabled:opacity-40 hover:bg-blue-50 shadow-sm whitespace-nowrap';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 px-3 py-2 text-sm">
      <Button
        variant="neutral"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={PAGE_BUTTON_CLASS}
      >
        Previous
      </Button>
      <span className="text-slate-600 font-medium whitespace-nowrap">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="neutral"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={PAGE_BUTTON_CLASS}
      >
        Next
      </Button>
    </div>
  );
}
