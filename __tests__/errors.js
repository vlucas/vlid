const { isNotValidWithErrors, isValidWithoutErrors } = require('./_util');
const v = require('../src/index');

describe('errors', () => {

  describe('multiple errors should be in array', () => {
    it('should throw error when used with rules that return a Promise', () => {
      const value = {
        isActive: 'true',
        num: '123',
      };
      const schema = v.object({
        isActive: v.boolean().required(),
        num: v.number().max(999).required(),
      });
      const result = schema.validateSync(value);
      const resultKeys = Object.keys(result);

      resultKeys.sort();

      expect(resultKeys).toEqual(['errors', 'isValid', 'path', 'results', 'value']);
    });
  });

  describe('results key', () => {
    it('errors should have results for each validation run', () => {
      const value = {
        isActive: 'true',
        num: '123',
      };
      const schema = v.object({
        isActive: v.boolean().required(),
        num: v.number().max(999).required(),
      });
      const result = schema.validateSync(value);
      const resultKeys = result.results.map(r => r.path);

      resultKeys.sort();

      expect(result.errors[0].message).toContain('Must be');
      expect(resultKeys).toEqual(['isActive', 'num']);
    });
  });

  describe('nested paths', () => {
    it('should have nested path separated by dot notation', () => {
      const value = {
        isActive: 'true',
        num: '123',
        nested: {
          bool: 123
        }
      };
      const schema = v.object({
        isActive: v.boolean().required(),
        num: v.number().max(999).required(),
        nested: {
          bool: v.boolean(),
        },
      }).cast();
      const result = schema.validateSync(value);

      expect(result.errors[0].message).toContain('Must be a boolean');
      expect(result.errors[0].path).toEqual('nested.bool');
    });
  });

});
