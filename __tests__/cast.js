const { isNotValidWithErrors, isValidWithoutErrors } = require('./_util');
const v = require('../src/index');

describe('cast', () => {

  describe('custom cast function', () => {
    it('should cast data according to custom cast function logic', () => {
      function stringSevenToNumber(data) {
        return data === 'seven' ? 7 : data;
      }

      let input = 'seven';
      let expected = 7;
      let result = v.validateSync(v.any().cast(stringSevenToNumber), input);

      isValidWithoutErrors(result);
      expect(result.data).toEqual(expected);
    });
  });

});

