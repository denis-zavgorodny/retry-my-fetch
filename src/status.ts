export const STATUS_BUSY = 'BUSY';
export const STATUS_IDLE = 'IDLE';

let status: 'BUSY' | 'IDLE' = STATUS_IDLE;

function checkStatusRecursively<T extends () => void>(resolve: T): void {
  if (status === STATUS_IDLE) {
    resolve();
    return;
  }

  setTimeout(() => {
    checkStatusRecursively(resolve);
  }, 1000);
}

export default {
  get: (): string => status,
  setBusy: (): void => {
    status = 'BUSY';
  },
  setIdle: (): void => {
    status = 'IDLE';
  },
  whenWillIdle: <T>(): Promise<T> =>
    new Promise((resolve) => {
      checkStatusRecursively(resolve);
    }),
};
