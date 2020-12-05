const sleep = (timeout: number): Promise<undefined> =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

export default sleep;
