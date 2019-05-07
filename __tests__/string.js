const { isNotValidWithErrors, isValidWithoutErrors } = require('./_util');
const v = require('../src/index');

describe('string', () => {

  describe('type', () => {
    it('should pass with string', () => {
      let result = v.validateSync(v.string(), 'test');

      isValidWithoutErrors(result);
    });

    it('should fail with number', () => {
      let result = v.validateSync(v.string(), 1);

      isNotValidWithErrors(result);
    });

    it('should fail with boolean', () => {
      let result = v.validateSync(v.string(), true);

      isNotValidWithErrors(result);
    });

    it('should fail with object', () => {
      let result = v.validateSync(v.string(), { foo: 'bar' });

      isNotValidWithErrors(result);
    });
  });

  describe('alphanum', () => {
    it('should pass with alphanumeric string', () => {
      let result = v.validateSync(v.string().alphanum(), 'SomethingElse3');

      isValidWithoutErrors(result);
    });

    it('should fail with non-alphanumeric string', () => {
      let result = v.validateSync(v.string().alphanum(), 'some thing else');

      isNotValidWithErrors(result);
    });
  });

  describe('email', () => {
    it('should pass with valid email', () => {
      let result = v.validateSync(v.string().email(), 'test@test.com');

      isValidWithoutErrors(result);
    });

    it('should pass with valid email', () => {
      let result = v.validateSync(v.string().email(), 'example@localhost.co.uk');

      isValidWithoutErrors(result);
    });

    it('should fail with invalid email', () => {
      let result = v.validateSync(v.string().email(), 'nope not at all');

      isNotValidWithErrors(result);
    });
  });

  describe('min', () => {
    it('should pass validation for strings longer than min length', () => {
      let result = v.validateSync(v.string().min(3), 'abcdef');

      isValidWithoutErrors(result);
    });

    it('should pass validation for strings equal to min length', () => {
      let result = v.validateSync(v.string().min(3), 'abc');

      isValidWithoutErrors(result);
    });

    it('should fail validation for strings shorter than min length', () => {
      let result = v.validateSync(v.string().min(3), 'ab');

      isNotValidWithErrors(result);
    });
  });

  describe('max', () => {
    it('should pass validation for strings shorter than max length', () => {
      let result = v.validateSync(v.string().min(1).max(3), 'ab');

      isValidWithoutErrors(result);
    });

    it('should pass validation for strings equal to max length', () => {
      let result = v.validateSync(v.string().min(1).max(3), 'abc');

      isValidWithoutErrors(result);
    });

    it('should fail validation for strings longer than max length', () => {
      let result = v.validateSync(v.string().min(1).max(3), 'abcdef');

      isNotValidWithErrors(result);
    });
  });

  describe('regex', () => {
    it('should pass with valid data matching regex', () => {
      let result = v.validateSync(v.string().regex(/^[0-9]+$/), '12412487');

      isValidWithoutErrors(result);
    });

    it('should fail with invalid data not matching regex', () => {
      let result = v.validateSync(v.string().regex(/^[0-9]+$/), '12412487x');

      isNotValidWithErrors(result);
    });
  });

  describe('url', () => {
    it('should pass with valid url', () => {
      let result = v.validateSync(v.string().url(), 'http://www.google.com/random-url');

      isValidWithoutErrors(result);
    });

    it('should fail with invalid url', () => {
      let result = v.validateSync(v.string().url(), 'nope not a url');

      isNotValidWithErrors(result);
    });
  });
});
