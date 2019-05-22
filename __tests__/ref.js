const { isNotValidWithErrors, isValidWithoutErrors } = require('./_util');
const v = require('../src/index');

describe('any', () => {

  describe('ref', () => {
    it('should alow reference to schema', () => {
      let startDate = v.date().iso();
      let endDate = v.date().iso().min(v.ref('startDate'));
      let schema = v.object({
        startDate,
        endDate,
      });
      let value = {
        startDate: '2019-10-05T14:48:00.000Z',
        endDate: '2019-10-06T14:48:00.000Z',
      };
      let result = v.validateSync(schema, value);

      isValidWithoutErrors(result);
    });

    it('should fail when ref value does not pass validation', () => {
      let startDate = v.date().iso();
      let endDate = v.date().iso().min(v.ref('startDate'));
      let schema = v.object({
        startDate,
        endDate,
      });
      let value = {
        startDate: '2019-10-07T14:48:00.000Z',
        endDate: '2019-10-06T14:48:00.000Z',
      };
      let result = v.validateSync(schema, value);

      expect(result.errors[0].message).toContain('Date must be after');
      expect(result.errors[0].path).toEqual('endDate');
      isNotValidWithErrors(result);
    });
  });

});
