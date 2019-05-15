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
      expect(result.errors[0].message).toContain(`is not a valid array`);
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
      expect(result.errors[0].message).toContain('"one" is not a number');
      expect(result.errors[1].message).toContain('"three" is not a number');
    });
  });

});
