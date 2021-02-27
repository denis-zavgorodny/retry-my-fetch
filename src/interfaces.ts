export interface beforeRefetchInterface {
  (url: string, options: fetchOptions, code: number, counter: number, isRejected: boolean): Promise<
    fetchOptions
  >;
}

export interface decoratorOptions {
  beforeRefetch: beforeRefetchInterface;
  maxTryCount?: number;
  timeout?: number;
  useAbortController?: boolean;
  doNotRefetchIfStatuses?: number[];
}

export interface fetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE';
  mode?: RequestMode;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: Headers;
  redirect?: RequestRedirect;
  referrerPolicy?: 'no-referrer' | 'client';
  body?: string;
  signal?: AbortSignal;
}

export interface Fetch {
  (url: string, options: fetchOptions): Promise<Response>;
}

export default {};
