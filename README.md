# retry-my-fetch

It's a decorator for `Fetch` API ([fetch](https://fetch.spec.whatwg.org/), [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch), [cross-fetch](https://github.com/lquixada/cross-fetch), etc.) which allows resending (retrying) your requests in case if that fails.

## npm package

```console
npm i retry-my-fetch
```

## Quick start

### Simple retry

```js
import retryMyFetch from 'retry-my-fetch';

const config = {
  maxTryCount: 5,
};
const fetchWithRetry = retryMyFetch(fetch, config);
fetchWithRetry('/').then(console.log);
```

### Retry with timeout

```js
import retryMyFetch from 'retry-my-fetch';

const config = {
  beforeRefetch: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    }),
  maxTryCount: 5,
};
const fetchWithRetry = retryMyFetch(fetch, config);
fetchWithRetry('/').then(console.log);
```

### Update JWT token and retry

```js
import retryMyFetch from 'retry-my-fetch';

const config = {
  beforeRefetch: async (url, fetchOptions, statusCode, retryConter) => {
    // do something, i.e. refresh JWT token
    const newAccessToken = await getToken(); // some async function
    // update fetch options
    const newFetchOptions = {
      ...fetchOptions,
      headers: new Headers({
        Authorization: `Bearer ${newAccessToken}`,
      }),
    };

    // return new options in order to retry call with new options
    return newFetchOptions;
  },
  maxTryCount: 5,
};
const fetchWithRetry = retryMyFetch(fetch, config);
const options = {
  headers: new Headers({
    Authorization: `Bearer ${someOldToken}`,
  }),
};
fetchWithRetry('/', options).then(console.log);
```

See `src/interfaces.ts` for further details.
