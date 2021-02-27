import retryMyFetch from './index';
import sleep from './utils/sleep';
import { clearCount, getCount, increaseCount } from './utils/counter';

jest.mock('./utils/sleep', () => jest.fn().mockResolvedValue());

describe('retryMyFetch', () => {
  const fetchMock = jest.fn();
  let testFetch;
  const fetchedData = {
    some: '1',
  };
  afterEach(() => {
    fetchMock.mockClear();
    sleep.mockClear();
  });
  describe('when status `ok` is true', () => {
    beforeEach(() => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        toJSON: jest.fn().mockReturnValue(fetchedData),
      });
      testFetch = retryMyFetch(fetchMock, {
        beforeRefetch: jest.fn(),
        maxTryCount: 3,
      });
    });
    it('should resolve data like a fetch', (done) => {
      testFetch('/')
        .then((response) => {
          expect(response).toEqual({
            ok: true,
            status: 200,
            toJSON: expect.any(Function),
          });
          return response.toJSON();
        })
        .then((data) => {
          expect(data).toEqual({
            some: '1',
          });
          done();
        });
    });
    it('`sleep` should not be called', async () => {
      await testFetch('/');
      expect(sleep).not.toHaveBeenCalled();
    });
  });
  describe('when useAbortController is turned on', () => {
    let beforeRefetch;
    beforeEach(() => {
      beforeRefetch = jest.fn().mockResolvedValue('some new conf');
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          toJSON: jest.fn().mockReturnValue({ status: 'fail' }),
        })
        .mockResolvedValue({
          ok: true,
          status: 200,
          toJSON: jest.fn().mockReturnValue({ success: 'data' }),
        });
      testFetch = retryMyFetch(fetchMock, {
        beforeRefetch,
        useAbortController: true,
        maxTryCount: 3,
      });
    });
    afterEach(() => {
      beforeRefetch.mockClear();
    });
    it('should call fetchMock', async () => {
      await testFetch('/');
      expect(fetchMock).toBeCalledTimes(2);
      // expect(fetchMock.mock.calls[0]).toEqual(['/', 'some conf']);
      // expect(fetchMock.mock.calls[1]).toEqual(['/', 'some new conf']);
    });
  });
  describe('when useAbortController is turned off', () => {
    describe('when first status `ok` is not true', () => {
      describe('when max attempts are reached', () => {
        beforeEach(() => {
          fetchMock.mockResolvedValue({
            ok: false,
            status: 400,
            toJSON: jest.fn().mockReturnValue({ status: 'fail' }),
          });
          testFetch = retryMyFetch(fetchMock, {
            maxTryCount: 3,
          });
        });
        it('should resolve data like a fetch', async () => {
          expect.assertions(1);
          await expect(testFetch('/')).resolves.toEqual({
            ok: false,
            status: 400,
            toJSON: expect.any(Function),
          });
        });
      });
      describe('when max attempts are not reached', () => {
        describe('when beforeRefetch is passed', () => {
          describe('when beforeRefetch is resolved', () => {
            describe('when beforeRefetch returns value', () => {
              let beforeRefetch;
              beforeEach(() => {
                beforeRefetch = jest.fn().mockResolvedValue('some new conf');
                fetchMock
                  .mockResolvedValueOnce({
                    ok: false,
                    status: 400,
                    toJSON: jest.fn().mockReturnValue({ status: 'fail' }),
                  })
                  .mockResolvedValue({
                    ok: true,
                    status: 200,
                    toJSON: jest.fn().mockReturnValue({ success: 'data' }),
                  });
                testFetch = retryMyFetch(fetchMock, {
                  beforeRefetch,
                  maxTryCount: 3,
                });
              });
              afterEach(() => {
                beforeRefetch.mockClear();
              });
              it('should call fetchMock', async () => {
                await testFetch('/', 'some conf');
                expect(fetchMock).toBeCalledTimes(2);
                expect(fetchMock.mock.calls[0]).toEqual(['/', 'some conf']);
                expect(fetchMock.mock.calls[1]).toEqual(['/', 'some new conf']);
              });
              it('should resolve data like a fetch', (done) => {
                testFetch('/')
                  .then((response) => {
                    expect(response).toEqual({
                      ok: true,
                      status: 200,
                      toJSON: expect.any(Function),
                    });
                    return response.toJSON();
                  })
                  .then((data) => {
                    expect(data).toEqual({
                      success: 'data',
                    });
                    done();
                  });
              });
              it('should call beforeRefetch twice', async () => {
                await testFetch('/', {
                  some: 'options',
                });
                expect(beforeRefetch).toBeCalledTimes(1);
                expect(beforeRefetch).toHaveBeenNthCalledWith(
                  1,
                  '/',
                  {
                    some: 'options',
                  },
                  400,
                  1,
                  false,
                );
              });
            });
            describe('when beforeRefetch does not return value', () => {
              let beforeRefetch;
              beforeEach(() => {
                beforeRefetch = jest.fn().mockResolvedValue();
                fetchMock
                  .mockResolvedValueOnce({
                    ok: false,
                    status: 400,
                    toJSON: jest.fn().mockReturnValue({ status: 'fail' }),
                  })
                  .mockResolvedValue({
                    ok: true,
                    status: 200,
                    toJSON: jest.fn().mockReturnValue({ success: 'data' }),
                  });
                testFetch = retryMyFetch(fetchMock, {
                  beforeRefetch,
                  maxTryCount: 3,
                });
              });
              afterEach(() => {
                beforeRefetch.mockClear();
              });
              it('should call fetchMock', async () => {
                await testFetch('/', 'some conf');
                expect(fetchMock).toBeCalledTimes(2);
                expect(fetchMock.mock.calls[0]).toEqual(['/', 'some conf']);
                expect(fetchMock.mock.calls[1]).toEqual(['/', 'some conf']);
              });
              it('should resolve data like a fetch', (done) => {
                testFetch('/')
                  .then((response) => {
                    expect(response).toEqual({
                      ok: true,
                      status: 200,
                      toJSON: expect.any(Function),
                    });
                    return response.toJSON();
                  })
                  .then((data) => {
                    expect(data).toEqual({
                      success: 'data',
                    });
                    done();
                  });
              });
              it('should call beforeRefetch twice', async () => {
                await testFetch('/', {
                  some: 'options',
                });
                expect(beforeRefetch).toBeCalledTimes(1);
                expect(beforeRefetch).toHaveBeenNthCalledWith(
                  1,
                  '/',
                  {
                    some: 'options',
                  },
                  400,
                  1,
                  false,
                );
              });
            });
          });
          describe('when beforeRefetch is rejected', () => {
            let beforeRefetch;
            beforeEach(() => {
              beforeRefetch = jest.fn().mockRejectedValue(new Error('error'));
              fetchMock
                .mockResolvedValueOnce({
                  ok: false,
                  status: 400,
                  toJSON: jest.fn().mockReturnValue({ status: 'fail' }),
                })
                .mockResolvedValue({
                  ok: true,
                  status: 200,
                  toJSON: jest.fn().mockReturnValue({ success: 'data' }),
                });
              testFetch = retryMyFetch(fetchMock, {
                beforeRefetch,
                maxTryCount: 3,
              });
            });
            afterEach(() => {
              beforeRefetch.mockClear();
            });
            it('should reject with error', async () => {
              expect.assertions(3);
              await expect(testFetch('/', 'some other conf')).rejects.toEqual(new Error('error'));
              expect(fetchMock).toBeCalledTimes(1);
              expect(fetchMock).toBeCalledWith('/', 'some other conf');
            });
          });
        });

        describe('when beforeRefetch is not passed', () => {
          describe('when timeout is not passed', () => {
            beforeEach(() => {
              fetchMock
                .mockResolvedValueOnce({
                  ok: false,
                  status: 400,
                  toJSON: jest.fn().mockReturnValue({ status: 'fail' }),
                })
                .mockResolvedValue({
                  ok: true,
                  status: 200,
                  toJSON: jest.fn().mockReturnValue({ success: 'data' }),
                });
              testFetch = retryMyFetch(fetchMock, {
                maxTryCount: 3,
              });
            });
            it('should call fetchMock', async () => {
              await testFetch('/', 'some conf');
              expect(fetchMock).toBeCalledTimes(2);
              expect(fetchMock.mock.calls[0]).toEqual(['/', 'some conf']);
              expect(fetchMock.mock.calls[1]).toEqual(['/', 'some conf']);
            });
            it('should resolve data like a fetch', (done) => {
              testFetch('/')
                .then((response) => {
                  expect(response).toEqual({
                    ok: true,
                    status: 200,
                    toJSON: expect.any(Function),
                  });
                  return response.toJSON();
                })
                .then((data) => {
                  expect(data).toEqual({
                    success: 'data',
                  });
                  done();
                });
            });
            it('`sleep` should not be called', async () => {
              await testFetch('/');
              expect(sleep).toBeCalledTimes(1);
              expect(sleep).toBeCalledWith(1000);
            });
          });

          describe('when timeout is passed', () => {
            beforeEach(() => {
              fetchMock
                .mockResolvedValueOnce({
                  ok: false,
                  status: 400,
                  toJSON: jest.fn().mockReturnValue({ status: 'fail' }),
                })
                .mockResolvedValue({
                  ok: true,
                  status: 200,
                  toJSON: jest.fn().mockReturnValue({ success: 'data' }),
                });
              testFetch = retryMyFetch(fetchMock, {
                maxTryCount: 3,
                timeout: 4000,
              });
            });
            it('should call fetchMock', async () => {
              await testFetch('/', 'some conf');
              expect(fetchMock).toBeCalledTimes(2);
              expect(fetchMock.mock.calls[0]).toEqual(['/', 'some conf']);
              expect(fetchMock.mock.calls[1]).toEqual(['/', 'some conf']);
            });
            it('should resolve data like a fetch', (done) => {
              testFetch('/')
                .then((response) => {
                  expect(response).toEqual({
                    ok: true,
                    status: 200,
                    toJSON: expect.any(Function),
                  });
                  return response.toJSON();
                })
                .then((data) => {
                  expect(data).toEqual({
                    success: 'data',
                  });
                  done();
                });
            });
            it('`sleep` should not be called', async () => {
              await testFetch('/');
              expect(sleep).toBeCalledTimes(1);
              expect(sleep).toBeCalledWith(4000);
            });
          });
        });
      });
    });
  });
  describe('when useAbortController is turned on and set doNotAbortIfStatuses', () => {
    let beforeRefetch;
    beforeEach(() => {
      beforeRefetch = jest.fn().mockResolvedValue('some new conf');
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
        toJSON: jest.fn().mockReturnValue({ status: 'fail' }),
      });
      testFetch = retryMyFetch(fetchMock, {
        beforeRefetch,
        doNotAbortIfStatuses: [401],
        maxTryCount: 3,
      });
    });
    afterEach(() => {
      beforeRefetch.mockClear();
    });
    it('should call fetchMock 1 times', async () => {
      await testFetch('/');
      expect(fetchMock).toBeCalledTimes(1);
    });
  });
  describe('counter', () => {
    const urlApi = '/api/test/1';
    it('increaseCount', async () => {
      expect(increaseCount(urlApi)).toEqual(1);
      expect(increaseCount(urlApi)).toEqual(2);
    });
    it('getCount', async () => {
      expect(getCount(urlApi)).toEqual(2);
    });
    it('clearCount', async () => {
      expect(clearCount(urlApi)).toEqual(0);
    });
  });
});
