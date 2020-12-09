import { ABORTED_STATUS_CODE, ABORTED_STATUS_TEXT } from '../constants';

const nullRequest = async (): Promise<Response> =>
  new Response(null, {
    status: ABORTED_STATUS_CODE,
    statusText: ABORTED_STATUS_TEXT,
  });

export default nullRequest;
