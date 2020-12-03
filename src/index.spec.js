import retryMyFetch from './index';

describe('retryMyFetch', () => {
  const fetchMock = jest.fn();
  let testFetch;
  const fetchedData = {
    some: '1',
  };
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
  });

  describe('when first status `ok` is not true', () => {
    describe('when max attempts are reached', () => {
      beforeEach(() => {
        fetchMock.mockResolvedValue({
          ok: false,
          status: 400,
          toJSON: jest.fn().mockReturnValue({ status: 'fail' }),
        });
        testFetch = retryMyFetch(fetchMock, {
          beforeRefetch: (statusCode, counter) => Promise.resolve(statusCode, counter),
          maxTryCount: 3,
        });
      });
      it('should reject with response data', async () => {
        expect.assertions(1);
        await expect(testFetch('/')).rejects.toEqual({
          ok: false,
          status: 400,
          toJSON: expect.any(Function),
        });
      });
    });
    describe('when max attempts are not reached', () => {
      describe('when beforeRefetch is passed', () => {
        describe('when beforeRefetch is resolved', () => {
          let beforeRefetch;
          beforeEach(() => {
            beforeRefetch = jest.fn().mockResolvedValue(true);
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
            );
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
          it('should reject with response data', async () => {
            expect.assertions(1);
            await expect(testFetch('/')).rejects.toEqual(new Error('error'));
          });
        });
      });

      describe('when beforeRefetch is not passed', () => {
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
      });
    });
  });
});
