const vArray = require('./vArray');
const vBase = require('./vBase');
const vBoolean = require('./vBoolean');
const vDate = require('./vDate');
const vNumber = require('./vNumber');
const vObject = require('./vObject');
const vString = require('./vString');
const { validateSync } = require('./validate');

module.exports = {
  any: () => new vBase(),
  array: () => new vArray(),
  boolean: () => new vBoolean(),
  date: () => new vDate(),
  number: () => new vNumber(),
  object: (obj) => new vObject(obj),
  string: () => new vString(),
  validateSync(schema, data) {
    return schema.validateSync ? schema.validateSync(data) : validateSync(schema, data);
  },
};
