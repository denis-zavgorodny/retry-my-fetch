export interface beforeRefetchInterface {
  (url: string, options: fetchOptions, code: number, counter: number): Promise<fetchOptions>;
}

export interface decoratorOptions {
  beforeRefetch: beforeRefetchInterface;
  maxTryCount?: number;
}

export interface fetchOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE';
  mode: RequestMode;
  cache: RequestCache;
  credentials: RequestCredentials;
  headers: Headers;
  redirect: RequestRedirect;
  referrerPolicy: 'no-referrer' | 'client';
  body: string;
}

export interface Fetch {
  (url: string, options: fetchOptions): Promise<Response>;
}

export default {};
