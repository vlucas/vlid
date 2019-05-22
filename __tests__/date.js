const { isNotValidWithErrors, isValidWithoutErrors } = require('./_util');
const v = require('../src/index');

describe('date', () => {

  describe('_base', () => {
    it('should pass validation for values that are date objects', () => {
      let value = new Date();
      let result = v.validateSync(v.date(), value);

      isValidWithoutErrors(result);
    });

    it('should fail validation for values that are not date objects', () => {
      let result = v.validateSync(v.date(), '2019-07-23');

      isNotValidWithErrors(result);
    });
  });

  describe('cast', () => {
    it('should attempt to cast date-like strings to Date object and pass validation', () => {
      let result = v.validateSync(v.date().cast(), '2019-05-10');

      isValidWithoutErrors(result);
      expect(result.value instanceof Date).toEqual(true);
    });

    it('should cast ISO-8601 date strings to Date object and pass validation', () => {
      let input = '2019-01-01T00:00:00.000Z';
      let result = v.validateSync(v.date().cast(), input);

      isValidWithoutErrors(result);
      expect(result.value instanceof Date).toEqual(true);
    });

    it('should cast strings with invalid dates to NaN and fail validation', () => {
      let input = 'not a date at all';
      let result = v.validateSync(v.date().cast(), input);

      isNotValidWithErrors(result);
      expect(result.errors[0].message).toContain('Must be a date');
    });
  });

  describe('min', () => {
    it('should pass validation for dates larger than min', () => {
      let input = new Date();
      let minDate = new Date();

      minDate.setDate(minDate.getDate() - 1);

      let result = v.validateSync(v.date().min(minDate), input);

      isValidWithoutErrors(result);
    });

    it('should pass validation for dates the same as the min', () => {
      let input = new Date();

      let result = v.validateSync(v.date().min(input), input);

      isValidWithoutErrors(result);
    });

    it('should fail validation for numbers lower than min', () => {
      let input = new Date();
      let minDate = new Date();

      minDate.setDate(minDate.getDate() + 1);

      let result = v.validateSync(v.date().min(minDate), input);

      isNotValidWithErrors(result);
      expect(result.errors[0].message).toContain('must be after');
    });
  });

  describe('max', () => {
    it('should pass validation for dates before the max', () => {
      let input = new Date();
      let maxDate = new Date();

      maxDate.setDate(maxDate.getDate() + 1);

      let result = v.validateSync(v.date().max(maxDate), input);

      isValidWithoutErrors(result);
    });

    it('should fail validation for dates after the max', () => {
      let input = new Date();
      let maxDate = new Date();

      maxDate.setDate(maxDate.getDate() - 1);

      let result = v.validateSync(v.date().max(maxDate), input);

      isNotValidWithErrors(result);
      expect(result.errors[0].message).toContain('must be before');
    });
  });

  describe('iso', () => {
    it('should pass validation for valid ISO-8601 dates', () => {
      let input = '2019-01-01T00:00:00.000Z';
      let result = v.validateSync(v.date().iso(), input);

      isValidWithoutErrors(result);
    });

    it('should pass validation for valid ISO-8601 dates', () => {
      let input = '2018-01-01';
      let result = v.validateSync(v.date().iso(), input);

      isNotValidWithErrors(result);
      expect(result.errors[0].message).toContain('ISO-8601 format');
    });
  });
});
