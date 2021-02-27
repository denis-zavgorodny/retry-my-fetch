const counter = new Map();

export const increaseCount = (url: string): void => {
  if (counter.has(url)) {
    counter.set(url, 1);
  } else {
    counter.set(url, counter.get(url) + 1);
  }
};

export const clearCount = (url: string): void => {
  counter.set(url, 0);
};

export const getCount = (url: string): number => Number(counter.get(url) || 0);
