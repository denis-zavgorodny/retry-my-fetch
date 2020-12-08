import { fetchOptions } from '../interfaces';
import abortController from '../abort-controller';

const injectAbortController = (options: fetchOptions): fetchOptions => {
  const { signal } = options;
  if (signal || !abortController.isAvailable()) return options;
  const abortControllerInstance = abortController.get();
  return {
    ...options,
    signal: abortControllerInstance.signal,
  };
};

export default injectAbortController;
