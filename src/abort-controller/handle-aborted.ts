import { ABORTED_STATUS_CODE, ABORTED_STATUS_TEXT } from '../constants';

const handleAborted = async (error: Error): Promise<Response> => {
  if (error.name !== ABORTED_STATUS_TEXT) throw error;

  return new Response(null, {
    status: ABORTED_STATUS_CODE,
    statusText: ABORTED_STATUS_TEXT,
  });
};

export default handleAborted;
