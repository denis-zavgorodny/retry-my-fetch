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
      const data = await http(url, options);
      counter += 1;

      if (data.ok === true || counter > maxTryCount) {
        status.setIdle();
        return data;
      }

      await status.whenWillIdle();
      status.setBusy();

      const updatedOptions = await beforeRefetch(url, options, data.status, counter);
      status.setIdle();
      return caller(url, updatedOptions);
    } catch (error) {
      status.setIdle();
      throw error;
    }
  };
  return caller;
}

export default retryMyFetch;
