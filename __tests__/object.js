const { isNotValidWithErrors, isValidWithoutErrors } = require('./_util');
const v = require('../src/index');

describe('object', () => {

  describe('type', () => {
    it('should pass with object', () => {
      let result = v.validateSync(v.object({}), {});

      isValidWithoutErrors(result);
    });

    it('should pass with plain object not wrapped in v.object()', () => {
      let result = v.validateSync({}, {});

      isValidWithoutErrors(result);
    });

    it('should pass with plain object not wrapped in v.object() async validate', async () => {
      let result = await v.validate({}, {});

      isValidWithoutErrors(result);
    });

    it('should fail with number', () => {
      let result = v.validateSync(v.object(1), 1);

      isNotValidWithErrors(result);
    });
  });

  describe('cast', () => {
    it('should cast all nested keys validation', () => {
      const value = {
        isActive: 'true',
        num: '123',
      };
      const schema = v.object({
        isActive: v.boolean().required(),
        num: v.number().max(999).required(),
      }).cast();
      const result = schema.validateSync(value);

      isValidWithoutErrors(result);
    });

    it('should cast all nested level 2 keys validation', () => {
      const value = {
        isActive: 'true',
        num: '123',
        data: {
          id: '5',
        }
      };
      const schema = v.object({
        isActive: v.boolean().required(),
        num: v.number().max(999).required(),
        data: v.object({
          id: v.number().required(),
        }),
      }).cast();
      const result = schema.validateSync(value);

      isValidWithoutErrors(result);
    });
  });

  describe('keys validation', () => {
    it('should validate an object with keys', () => {
      const value = {
        foo: 'bar',
      };
      const schema = v.object({
        'foo': v.string().required(),
      });
      const result = schema.validateSync(value);

      isValidWithoutErrors(result);
    });

    it('should validate an object with keys is not valid', () => {
      const value = {
        foo: 1,
      };
      const schema = v.object({
        'foo': v.string().required(),
      });
      const result = schema.validateSync(value);

      isNotValidWithErrors(result);
    });
  });

});
