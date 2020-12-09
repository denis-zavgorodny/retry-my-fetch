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
  isBusy: (): boolean => status === STATUS_BUSY,
  setBusy: (): void => {
    status = STATUS_BUSY;
  },
  setIdle: (): void => {
    status = STATUS_IDLE;
  },
  whenWillIdle: <T>(): Promise<T> =>
    new Promise((resolve) => {
      checkStatusRecursively(resolve);
    }),
};
