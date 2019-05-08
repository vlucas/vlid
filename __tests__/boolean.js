const { isNotValidWithErrors, isValidWithoutErrors } = require('./_util');
const v = require('../src/index');

describe('boolean', () => {

  describe('_base', () => {
    it('should fail validation for values that are not boolean', () => {
      let result = v.validateSync(v.boolean(), 'definitely not a number here');

      isNotValidWithErrors(result);
    });

    it('should pass validation for values that are boolean true', () => {
      let result = v.validateSync(v.boolean(), true);

      isValidWithoutErrors(result);
    });

    it('should pass validation for values that are boolean false', () => {
      let result = v.validateSync(v.boolean(), false);

      isValidWithoutErrors(result);
    });

    it('should fail validation with number 1 without cast', () => {
      let result = v.validateSync(v.boolean(), 1);

      isNotValidWithErrors(result);
    });

    it('should fail validation with string "true" without cast', () => {
      let result = v.validateSync(v.boolean(), 'true');

      isNotValidWithErrors(result);
    });
  });

  describe('cast', () => {
    it('should cast number 1 to boolean true', () => {
      let result = v.validateSync(v.boolean().cast(), 1);

      isValidWithoutErrors(result);
      expect(result.data).toBe(true);
    });

    it('should cast number 0 to boolean false', () => {
      let result = v.validateSync(v.boolean().cast(), 0);

      isValidWithoutErrors(result);
      expect(result.data).toBe(false);
    });

    it('should cast string "on" to boolean true', () => {
      let result = v.validateSync(v.boolean().cast(), 'on');

      isValidWithoutErrors(result);
      expect(result.data).toBe(true);
    });

    it('should cast string "off" to boolean false', () => {
      let result = v.validateSync(v.boolean().cast(), 'off');

      isValidWithoutErrors(result);
      expect(result.data).toBe(false);
    });

    it('should cast string "TRUE" to boolean true', () => {
      let result = v.validateSync(v.boolean().cast(), 'TRUE');

      isValidWithoutErrors(result);
      expect(result.data).toBe(true);
    });

    it('should cast string "FALSE" to boolean false', () => {
      let result = v.validateSync(v.boolean().cast(), 'FALSE');

      isValidWithoutErrors(result);
      expect(result.data).toBe(false);
    });

    it('should cast string "T" to boolean true', () => {
      let result = v.validateSync(v.boolean().cast(), 'T');

      isValidWithoutErrors(result);
      expect(result.data).toBe(true);
    });

    it('should cast string "F" to boolean false', () => {
      let result = v.validateSync(v.boolean().cast(), 'F');

      isValidWithoutErrors(result);
      expect(result.data).toBe(false);
    });

    it('should cast string "yes" to boolean true', () => {
      let result = v.validateSync(v.boolean().cast(), 'yes');

      isValidWithoutErrors(result);
      expect(result.data).toBe(true);
    });

    it('should cast string "no" to boolean false', () => {
      let result = v.validateSync(v.boolean().cast(), 'no');

      isValidWithoutErrors(result);
      expect(result.data).toBe(false);
    });

    it('should fail validation with string "true" without cast', () => {
      let result = v.validateSync(v.boolean(), 'true');

      isNotValidWithErrors(result);
    });
  });
});

