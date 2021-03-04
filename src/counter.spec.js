
import { clearCount, getCount, increaseCount } from './utils/counter';

describe('counter functions tests', () => {
  const urlApi = '/api/test/1';
  const urlApi1 = '/api/test/2';
  const urlApi2 = '/api/test/3';
  describe(`after calling increaseCount 2 times for '${urlApi}' getCount should return 2`, () => {
    increaseCount(urlApi);
    increaseCount(urlApi);
    it('getCount', async () => {
      expect(getCount(urlApi)).toEqual(2);
    });
  });
  describe(`after calling clearCount for '${urlApi1}' getCount should return 0`, () => {
    increaseCount(urlApi1);
    increaseCount(urlApi1);
    clearCount(urlApi1);
    it('getCount', async () => {
      expect(getCount(urlApi1)).toEqual(0);
    });
  });
  describe(`function getCount for not set url - '${urlApi2}' should return 0`, () => {
    it('getCount', async () => {
      expect(getCount(urlApi2)).toEqual(0);
    });
  });
});
