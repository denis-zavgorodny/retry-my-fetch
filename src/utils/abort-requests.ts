import abortControllerInstance from '../abort-controller/index';
import initAbortController from '../abort-controller/init-abort-controller';

const abortRequests = (): void => {
  const instance = abortControllerInstance.get();
  instance.abort();
  initAbortController();
};

export default abortRequests;
