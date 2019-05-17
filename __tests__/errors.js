const { isNotValidWithErrors, isValidWithoutErrors } = require('./_util');
const v = require('../src/index');

describe('errors', () => {

  describe('multiple errors should be in array', () => {
    it('should throw error when used with rules that return a Promise', () => {
      const data = {
        isActive: 'true',
        num: '123',
      };
      const schema = v.object({
        isActive: v.boolean().required(),
        num: v.number().max(999).required(),
      });
      const result = schema.validateSync(data);
      const resultKeys = Object.keys(result);

      resultKeys.sort();

      expect(resultKeys).toEqual(['data', 'errors', 'isValid', 'path', 'results']);
    });
  });

  describe('results key', () => {
    it('errors should have results for each validation run', () => {
      const data = {
        isActive: 'true',
        num: '123',
      };
      const schema = v.object({
        isActive: v.boolean().required(),
        num: v.number().max(999).required(),
      });
      const result = schema.validateSync(data);
      const resultKeys = result.results.map(r => r.path);

      resultKeys.sort();

      expect(result.errors[0].message).toContain('Must be');
      expect(resultKeys).toEqual(['isActive', 'num']);
    });
  });

});
