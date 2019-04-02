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
    it('should pass validation for strings shorter than max', () => {
      let result = v.validateSync(v.number().min(1).max(3), 2);

      isValidWithoutErrors(result);
    });
  });
});
