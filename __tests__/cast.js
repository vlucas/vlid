const { isNotValidWithErrors, isValidWithoutErrors } = require('./_util');
const v = require('../src/index');

describe('cast', () => {

  describe('custom cast function', () => {
    it('should cast value according to custom cast function logic', () => {
      function stringSevenToNumber(value) {
        return value === 'seven' ? 7 : value;
      }

      let input = 'seven';
      let expected = 7;
      let result = v.validateSync(v.any().cast(stringSevenToNumber), input);

      isValidWithoutErrors(result);
      expect(result.value).toEqual(expected);
    });
  });

});

