const handleAborted = async (error: Error): Promise<Response> => {
  if (error.name !== 'AbortError') throw error;

  return new Response(null, {
    status: 499,
    statusText: 'AbortError',
  });
};

export default handleAborted;
