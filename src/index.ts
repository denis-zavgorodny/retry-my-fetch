import { beforeRefetchInterface, decoratorOptions, fetchOptions, Fetch } from './interfaces';
import sleep from './utils/sleep';
import status from './status';
import injectAbortController from './utils/inject-abort-controller';
import initAbortController from './abort-controller/init-abort-controller';
import abortControllerInstance from './abort-controller/index';
import handleAborted from './abort-controller/handle-aborted';
import wasRequestRejected from './utils/was-request-rejected';
import abortRequests from './utils/abort-requests';
import nullRequest from './utils/null-request';
import { clearCount, getCount, increaseCount } from './utils/counter';

function retryMyFetch(http: Fetch, params: decoratorOptions): Fetch {
  const { useAbortController } = params;
  if (useAbortController) initAbortController();
  const caller: Fetch = async function caller(
    url: string,
    options: fetchOptions = {},
  ): Promise<Response> {
    try {
      const { timeout = 1000 } = params;
      const defaultRefreshCallback: beforeRefetchInterface = () => sleep(timeout);
      const {
        beforeRefetch = defaultRefreshCallback,
        maxTryCount = 5,
        doNotAbortIfStatuses,
      } = params;
      const isBusy: boolean = status.isBusy();

      const data = isBusy
        ? await nullRequest()
        : await http(url, useAbortController ? injectAbortController(options) : options).catch(
            handleAborted,
          );
      increaseCount(url);

      if (
        (doNotAbortIfStatuses && !doNotAbortIfStatuses.includes(data.status)) ||
        data.ok === true ||
        getCount(url) > maxTryCount
      ) {
        clearCount(url);
        return data;
      }

      if (!wasRequestRejected(data) && abortControllerInstance.get()) {
        abortRequests();
      }

      await status.whenWillIdle();
      status.setBusy();
      const updatedOptions = await beforeRefetch(
        url,
        options,
        data.status,
        getCount(url),
        wasRequestRejected(data),
      );
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
