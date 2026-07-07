import { useCallback, useState } from 'react';
import { useToast } from '../context/ToastContext';

export function useAsyncAction(fallbackMessage) {
  const [isBusy, setIsBusy] = useState(false);
  const { showError } = useToast();

  const run = useCallback(async (action, { onSuccess } = {}) => {
    setIsBusy(true);
    try {
      const result = await action();
      onSuccess?.(result);
      return result;
    } catch (err) {
      showError(err.message || fallbackMessage);
      return undefined;
    } finally {
      setIsBusy(false);
    }
  }, [fallbackMessage, showError]);

  return [isBusy, run];
}
