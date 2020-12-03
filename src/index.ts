import { beforeRefetchInterface, decoratorOptions, fetchOptions, Fetch } from './interfaces';
import status from './status';

function retryMyFetch(http: Fetch, params: decoratorOptions): Fetch {
  let counter = 0;
  const caller: Fetch = async function caller(
    url: string,
    options: fetchOptions,
  ): Promise<Response> {
    try {
      const defaultRefreshCallback: beforeRefetchInterface = () => Promise.resolve(options);
      const { beforeRefetch = defaultRefreshCallback, maxTryCount = 5 } = params;
      await status.whenWillIdle();
      status.setBusy();
      const data = await http(url, options);

      if (data.ok === true) {
        status.setIdle();
        return data;
      }

      counter += 1;
      if (counter > maxTryCount) {
        status.setIdle();
        return data;
      }

      const updatedOptions = await beforeRefetch(url, options, data.status, counter);
      status.setIdle();
      const resolvedData = await caller(url, updatedOptions);
      status.setIdle();
      return resolvedData;
    } catch (error) {
      status.setIdle();
      throw error;
    }
  };
  return caller;
}

export default retryMyFetch;
