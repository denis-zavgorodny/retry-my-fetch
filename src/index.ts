import { beforeRefetchInterface, decoratorOptions, fetchOptions, Fetch } from './interfaces';
import status from './status';

function retryMyFetch(http: Fetch, params: decoratorOptions): Fetch {
  let counter = 0;
  const caller: Fetch = function caller(url: string, options: fetchOptions) {
    const defaultRefreshCallback: beforeRefetchInterface = () => Promise.resolve(options);
    const { beforeRefetch = defaultRefreshCallback, maxTryCount = 5 } = params;
    return new Promise((resolve, reject) => {
      status.whenWillIdle().then(() => {
        http(url, options).then((data) => {
          if (data.ok === true) {
            resolve(data);
            return;
          }

          status.setBusy();
          counter += 1;
          if (counter > maxTryCount) {
            status.setIdle();
            reject(data);
            return;
          }
          beforeRefetch(url, options, data.status, counter)
            .then((updatedOptions) => {
              status.setIdle();
              return caller(url, updatedOptions).then((resolvedData) => {
                status.setIdle();
                resolve(resolvedData);
              });
            })
            .catch((e) => {
              status.setIdle();
              reject(e);
            });
        });
      });
    });
  };
  return caller;
}

export default retryMyFetch;
