import { ABORTED_STATUS_CODE, ABORTED_STATUS_TEXT } from '../constants';

const wasRequestRejected = (response: Response): boolean =>
  response.status === ABORTED_STATUS_CODE && response.statusText === ABORTED_STATUS_TEXT;

export default wasRequestRejected;
