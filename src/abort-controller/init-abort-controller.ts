import instance from './index';

const initAbortController = (): void => {
  if (!instance.isAvailable()) return;
  try {
    const controller = new AbortController();
    instance.set(controller);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export default initAbortController;
