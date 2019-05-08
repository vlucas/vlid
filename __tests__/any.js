const { isNotValidWithErrors, isValidWithoutErrors } = require('./_util');
const v = require('../src/index');

describe('any', () => {

  describe('_base', () => {
    it('should allow undefined', () => {
      let input = undefined;
      let result = v.validateSync(v.any(), input);

      isValidWithoutErrors(result);
      expect(result.data).toEqual(input);
    });

    it('should allow null', () => {
      let input = null;
      let result = v.validateSync(v.any(), input);

      isValidWithoutErrors(result);
      expect(result.data).toEqual(input);
    });

    it('should allow string type', () => {
      let input = 'some string';
      let result = v.validateSync(v.any(), input);

      isValidWithoutErrors(result);
      expect(result.data).toEqual(input);
    });

    it('should allow number type', () => {
      let input = 123;
      let result = v.validateSync(v.any(), input);

      isValidWithoutErrors(result);
      expect(result.data).toEqual(input);
    });

    it('should allow boolean type', () => {
      let input = true;
      let result = v.validateSync(v.any(), input);

      isValidWithoutErrors(result);
      expect(result.data).toEqual(input);
    });

    it('should allow object type', () => {
      let input = { foo: 'bar' };
      let result = v.validateSync(v.any(), input);

      isValidWithoutErrors(result);
      expect(result.data).toEqual(input);
    });
  });

});
