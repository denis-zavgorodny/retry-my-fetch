interface beforeRefetch {
  (code: number, counter: number): Promise<any>
}

interface decoratorOptions {
  beforeRefetch: beforeRefetch,
  maxTryCount?: number,
}


function retryMyFetch<A extends string, B extends object , T extends (url:A, options: B) => Promise<any>>(http:T, params: decoratorOptions):Function {
  let counter:number = 0;
  const caller = function<T>(url:A, options: B) {
    const { beforeRefetch, maxTryCount = 5 } = params;
    return new Promise((resolve, reject) => {
      http(url, options).then(data => {
        if(data.ok !== true) {
          counter++;
          if(counter <= maxTryCount) {
            beforeRefetch(200, counter).then(() => {
              caller(url, options).then(resolve).catch(reject);
            }).catch(reject);
          } else {
            reject(data);
          }
        } else {
          resolve(data);
        }
      });
    });
  }
  return caller;
}

export default retryMyFetch;




