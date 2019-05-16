const { isNotValidWithErrors, isValidWithoutErrors } = require('./_util');
const v = require('../src/index');

describe('array', () => {

  describe('type', () => {
    it('should pass with array', () => {
      let result = v.validateSync(v.array(), []);

      isValidWithoutErrors(result);
    });

    it('should fail with number', () => {
      let result = v.validateSync(v.array(1), 1);

      isNotValidWithErrors(result);
      expect(result.errors[0].message).toContain('Must be an array');
    });
  });

  describe('items', () => {
    it('should validate each item in array against provided schema', () => {
      let input = [1, 2, 3];
      let result = v.validateSync(v.array().items(v.number()), input);

      isValidWithoutErrors(result);
    });

    it('should validate each item in array against provided schema with errors', () => {
      let input = ['one', 2, 'three'];
      let result = v.validateSync(v.array().items(v.number()), input);

      isNotValidWithErrors(result);
      expect(result.errors[0].message).toContain('Must be a number');
      expect(result.errors[1].message).toContain('Must be a number');
    });
  });

  describe('min', () => {
    it('should validate array has min number of items', () => {
      let input = [];
      let result = v.validateSync(v.array().min(1), input);

      isNotValidWithErrors(result);
      expect(result.errors[0].message).toContain('must be at least 1');
    });

    it('should pass validation when array has min number of items', () => {
      let input = [42];
      let result = v.validateSync(v.array().min(1), input);

      isValidWithoutErrors(result);
    });
  });

  describe('max', () => {
    it('should validate array has max number of items', () => {
      let input = [1, 2, 3];
      let result = v.validateSync(v.array().max(1), input);

      isNotValidWithErrors(result);
      expect(result.errors[0].message).toContain('must be no greater than 1');
    });

    it('should pass validation when array has max number of items', () => {
      let input = [1, 2, 3];
      let result = v.validateSync(v.array().max(3), input);

      isValidWithoutErrors(result);
    });
  });

});
