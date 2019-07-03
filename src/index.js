const { isPlainObject } = require('./util');
const vArray = require('./vArray');
const vBase = require('./vBase');
const vBoolean = require('./vBoolean');
const vDate = require('./vDate');
const vNumber = require('./vNumber');
const vObject = require('./vObject');
const vString = require('./vString');
const { validate, validateSync, ValidationError, ref } = require('./validate');

module.exports = {
  any: () => new vBase(),
  array: () => new vArray(),
  boolean: () => new vBoolean(),
  date: () => new vDate(),
  number: () => new vNumber(),
  object: obj => new vObject(obj),
  ref,
  string: () => new vString(),
  validate(schema, data) {
    if (!schema.value && isPlainObject(schema)) {
      schema = new vObject(schema);
    }

    return schema.validate ? schema.validate(data) : validate(schema, data);
  },
  validateSync(schema, data) {
    if (!schema.value && isPlainObject(schema)) {
      schema = new vObject(schema);
    }

    return schema.validateSync ? schema.validateSync(data) : validateSync(schema, data);
  },
  ValidationError,
};
