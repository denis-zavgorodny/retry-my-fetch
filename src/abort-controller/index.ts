let instance: AbortController;

export default {
  get: (): AbortController => instance,
  set: (controller: AbortController): void => {
    instance = controller;
  },
  isAvailable: (): boolean => !!instance || !!AbortController,
};
