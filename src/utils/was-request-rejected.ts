const wasRequestRejected = (response: Response): boolean =>
  response.status === 499 && response.statusText === 'AbortError';

export default wasRequestRejected;
