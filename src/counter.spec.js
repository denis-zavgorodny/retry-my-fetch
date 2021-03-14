import { clearCount, getCount, increaseCount } from './utils/counter';

describe('counter functions tests', () => {
  const urlApi = '/api/test/1';
  const urlApi1 = '/api/test/2';
  const urlApi2 = '/api/test/3';
  describe(`when increaseCount was called 2 times for '${urlApi}'`, () => {
    it(`it should return 2`, () => {
      increaseCount(urlApi);
      increaseCount(urlApi);
      expect(getCount(urlApi)).toEqual(2);
    });
  });
  describe(`when clearCount was called for '${urlApi}'`, () => {
    it(`it should return 0`, () => {
      increaseCount(urlApi1);
      increaseCount(urlApi1);
      clearCount(urlApi1);
      expect(getCount(urlApi1)).toEqual(0);
    });  
  });  
  describe(`when getCount was called for undefined URL`, () => {
    it(`it should return 0`, () => {
      expect(getCount(urlApi2)).toEqual(0);
    });
  });
});
