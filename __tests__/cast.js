const { isNotValidWithErrors, isValidWithoutErrors } = require('./_util');
const v = require('../src/index');

describe('base validator', () => {
  it('should return an objet with "any" as a function', () => {
    expect(typeof v.any).toEqual('function');
  });

  it('should return an objet with "string" as a function', () => {
    expect(typeof v.string).toEqual('function');
  });
});
