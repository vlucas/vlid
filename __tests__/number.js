const { isNotValidWithErrors, isValidWithoutErrors } = require('./_util');
const v = require('../src/index');

describe('number', () => {

  describe('_base', () => {
    it('should fail validation for values that are not numbers', () => {
      let result = v.validateSync(v.number(), 'definitely not a number here');

      isNotValidWithErrors(result);
    });
  });

  describe('min', () => {
    it('should pass validation for numbers larger than min', () => {
      let result = v.validateSync(v.number().min(3), 10);

      isValidWithoutErrors(result);
    });

    it('should fail validation for numbers lower than min', () => {
      let result = v.validateSync(v.number().min(3), 2);

      isNotValidWithErrors(result);
    });
  });

  describe('max', () => {
    it('should pass validation for numbers lower than max', () => {
      let result = v.validateSync(v.number().min(1).max(3), 2);

      isValidWithoutErrors(result);
    });

    it('should fail validation for numbers higher than max', () => {
      let result = v.validateSync(v.number().min(1).max(3), 4);

      isNotValidWithErrors(result);
    });
  });

  describe('cast', () => {
    it('should cast strings with numbers in them to numbers', () => {
      let result = v.validateSync(v.number().cast(), '1');

      isValidWithoutErrors(result);
      expect(result.value).toBe(1);
    });

    it('should cast non-number strings to NaN and fail _base type validation', () => {
      let result = v.validateSync(v.number().cast(), 'whatever string');

      isNotValidWithErrors(result);
      expect(result.errors[0].message).toContain('Must be a number');
    });
  });
});
