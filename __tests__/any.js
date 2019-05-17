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

  describe('default', () => {
    it('should be able to be provide a default value', () => {
      let input = undefined;
      let result = v.validateSync(v.string().default(null), input);

      isValidWithoutErrors(result);
      expect(result.data).toEqual(null);
    });
  });

  describe('allow', () => {
    it('should be able to be provide an allowed value that is not the validation type', () => {
      let input = 'string';
      let result = v.validateSync(v.number().allow(input), input);

      isValidWithoutErrors(result);
      expect(result.data).toEqual(input);
    });

    it('should be able to be provide an array of allowed values', () => {
      let input = 'one';
      let allowed = ['one', 'two'];
      let result = v.validateSync(v.number().allow(allowed), input);

      isValidWithoutErrors(result);
      expect(result.data).toEqual(input);
    });
  });

  describe('array of rules', () => {
    it('array of validation rules passes either one', () => {
      let input = 123;
      let result = v.validateSync([v.string(), v.number()], input);

      isValidWithoutErrors(result);
      expect(result.errors).toEqual([]);
      expect(result.data).toEqual(input);
    });

    it('array of validation rules fails when all validation rules fail', () => {
      let input = 123;
      let result = v.validateSync([v.boolean(), v.string()], input);

      isNotValidWithErrors(result);
      expect(result.data).toEqual(input);
    });

    it('array of multiple validation rule failures are reported as a single error', () => {
      let input = 123;
      let result = v.validateSync([v.boolean(), v.string()], input);

      isNotValidWithErrors(result);
      expect(result.data).toEqual(input);
      expect(result.errors[0].message).toContain('Must be a boolean');
      expect(result.errors[0].message).toContain('Must be a string');
      expect(result.errors.length).toEqual(1);
    });
  });

  describe('validate', () => {
    it('should return a Promise for async validation resolution', () => {
      let input = 'supercalifragilisticexpialadocious';
      let promise = v.validate(v.string().required(), input);

      expect(promise instanceof Promise).toBe(true);

      return promise;
    });

    it('should reject a Promise for async validation failures', () => {
      let input = 12345;
      let promise = v.validate(v.string().required(), input);

      return promise
        .then(() => {
          expect('should have rejected this...').toBe(false, 'Promise was supposed to be rejected');
        })
        .catch(err => {
          expect(err.errors[0].message).toContain('Must be a string');
          expect(err.data).toBe(input);
        });
    });

    it('should handle a custom validation rule that returns a Promise', () => {
      let input = 'supercalifragilisticexpialadocious';
      let promise = v.validate(v.any().rule((value) => Promise.resolve(true)).required(), input);

      expect(promise instanceof Promise).toBe(true);

      return promise;
    });
  });

  describe('validateSync', () => {
    it('should throw error when used with rules that return a Promise', () => {
      let input = 'supercalifragilisticexpialadocious';

      expect(() => {
        v.validateSync(v.any().rule((value) => Promise.resolve(true)).required(), input);
      }).toThrow(new Error('Cannot return Promise futures from vlid.validateSync()'));
    });
  });

});
