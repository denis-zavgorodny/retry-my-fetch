interface beforeRefetch {
  (url: string, options: fetchOptions, code: number, counter: number): Promise<fetchOptions>;
}

interface decoratorOptions {
  beforeRefetch: beforeRefetch;
  maxTryCount?: number;
}

interface fetchOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE';
  mode: RequestMode;
  cache: RequestCache;
  credentials: RequestCredentials;
  headers: Headers;
  redirect: RequestRedirect;
  referrerPolicy: 'no-referrer' | 'client';
  body: string;
}

interface Fetch {
  (url: string, options: fetchOptions): Promise<Response>;
}

function retryMyFetch(http: Fetch, params: decoratorOptions): Fetch {
  let counter = 0;
  const caller: Fetch = function (url: string, options: fetchOptions) {
    const defaultRefreshCallback: beforeRefetch = () => Promise.resolve(options);
    const { beforeRefetch = defaultRefreshCallback, maxTryCount = 5 } = params;
    return new Promise((resolve, reject) => {
      http(url, options).then((data) => {
        if (data.ok !== true) {
          counter += 1;
          if (counter <= maxTryCount) {
            beforeRefetch(url, options, data.status, counter)
              .then((updatedOptions) => {
                caller(url, updatedOptions).then(resolve).catch(reject);
              })
              .catch(() => {
                reject(data);
              });
          } else {
            reject(data);
          }
        } else {
          resolve(data);
        }
      });
    });
  };
  return caller;
}

export default retryMyFetch;
