import retryMyFetch from './index.ts';

describe('retryMyFetch', () => {
  const fetchMock = jest.fn();
  let testFetch;
  const fetchedData = {
    some: '1',
  };
  describe('when status code is 200', () => {
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
    it('should work', (done) => {
      testFetch('/').then((response) => {
        expect(response).toEqual({
          ok: true,
          status: 200,
          toJSON: expect.any(Function),
        });
        return response.toJSON();
      }).then((data) => {
        expect(data).toEqual({
          some: '1',
        });
        done();
      });
    });
  });

  describe('when status code is not 200', () => {
    beforeEach(() => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        toJSON: jest.fn().mockReturnValue({status: 'fail'}),
      });
      testFetch = retryMyFetch(fetchMock, {
        beforeRefetch: (statusCode, counter) => Promise.resolve(statusCode, counter),
        maxTryCount: 3,
      });
    });
    it('should work', async () => {
      expect.assertions(1);
      await expect(testFetch('/')).rejects.toEqual({
        ok: false,
        status: 400,
        toJSON: expect.any(Function),
      });
    });
  });
});
