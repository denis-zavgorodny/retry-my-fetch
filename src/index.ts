import { beforeRefetchInterface, decoratorOptions, fetchOptions, Fetch } from './interfaces';
import sleep from './utils/sleep';
import status from './status';

function retryMyFetch(http: Fetch, params: decoratorOptions): Fetch {
  let counter = 0;
  const caller: Fetch = async function caller(
    url: string,
    options: fetchOptions,
  ): Promise<Response> {
    try {
      const { timeout = 1000 } = params;
      const defaultRefreshCallback: beforeRefetchInterface = () => sleep(timeout);
      const { beforeRefetch = defaultRefreshCallback, maxTryCount = 5 } = params;
      const data = await http(url, options);
      counter += 1;

      if (data.ok === true || counter > maxTryCount) return data;

      await status.whenWillIdle();
      status.setBusy();
      const updatedOptions = await beforeRefetch(url, options, data.status, counter);
      status.setIdle();
      return caller(url, updatedOptions || options);
    } catch (error) {
      status.setIdle();
      throw error;
    }
  };
  return caller;
}

export default retryMyFetch;
