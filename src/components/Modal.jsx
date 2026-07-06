export default function Modal({ labelledBy, maxWidth = 'max-w-md', onClose, role = 'dialog', children }) {
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4"
      onClick={onClose}
    >
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidth} bg-white rounded-xl shadow-lg ring-1 ring-slate-200 p-4 sm:p-5`}
      >
        {children}
      </div>
    </div>
  );
}
