let instance: AbortController;

export default {
  get: (): AbortController => instance,
  set: (controller: AbortController): void => {
    instance = controller;
  },
  isAvailable: (): boolean => {
    let isAbortControllerAvailable;
    try {
      isAbortControllerAvailable = !!new AbortController();
    } catch (_) {
      isAbortControllerAvailable = false;
    }
    return !!instance || isAbortControllerAvailable;
  },
};
