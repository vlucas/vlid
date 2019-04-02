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

describe('any', () => {
  describe('required', () => {
    it('should fail on undefined', () => {
      let result = v.validateSync(v.any().required(), undefined);

      isNotValidWithErrors(result);
    });

    it('should fail on null', () => {
      let result = v.validateSync(v.any().required(), null);

      isNotValidWithErrors(result);
    });

    it('should fail on empty string', () => {
      let result = v.validateSync(v.any().required(), '');

      isNotValidWithErrors(result);
    });

    it('should pass on non-empty string', () => {
      let result = v.validateSync(v.any().required(), 'test');

      isValidWithoutErrors(result);
    });
  });
});
