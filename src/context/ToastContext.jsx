import { createContext, useContext, useCallback, useState, useRef } from 'react';

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback((message, type = 'error') => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    const timer = setTimeout(() => dismissToast(id), 5000);
    timers.current.set(id, timer);
  }, [dismissToast]);

  const showError = useCallback((message) => showToast(message, 'error'), [showToast]);
  const showSuccess = useCallback((message) => showToast(message, 'success'), [showToast]);

  const toastStyles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  };
  const dismissStyles = {
    error: 'text-red-500 hover:text-red-700',
    success: 'text-emerald-500 hover:text-emerald-700',
  };

  return (
    <ToastContext.Provider value={{ showError, showSuccess }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`flex items-start gap-2 border text-sm rounded-md px-3 py-2 shadow-md animate-in ${toastStyles[toast.type] || toastStyles.error}`}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className={`leading-none ${dismissStyles[toast.type] || dismissStyles.error}`}
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
