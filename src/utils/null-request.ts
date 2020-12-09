const nullRequest = async (): Promise<Response> =>
  new Response(null, {
    status: 499,
    statusText: 'AbortError',
  });

export default nullRequest;
