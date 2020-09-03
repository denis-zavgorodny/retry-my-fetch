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
          if (data.ok !== true) {
            status.setBusy();
            counter += 1;
            if (counter <= maxTryCount) {
              beforeRefetch(url, options, data.status, counter)
                .then((updatedOptions) => {
                  status.setIdle();
                  caller(url, updatedOptions)
                    .then((resolvedData) => {
                      status.setIdle();
                      resolve(resolvedData);
                    })
                    .catch((e) => {
                      status.setIdle();
                      reject(e);
                    });
                })
                .catch(() => {
                  status.setIdle();
                  reject(data);
                });
            } else {
              status.setIdle();
              reject(data);
            }
          } else {
            resolve(data);
          }
        });
      });
    });
  };
  return caller;
}

export default retryMyFetch;
