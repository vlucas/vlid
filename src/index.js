const vBase = require('./vBase');
const vBoolean = require('./vBoolean');
const vNumber = require('./vNumber');
const vObject = require('./vObject');
const vString = require('./vString');

module.exports = {
  any: () => new vBase(),
  boolean: () => new vBoolean(),
  number: () => new vNumber(),
  object: (obj) => new vObject(obj),
  string: () => new vString(),
  validateSync(schema, data) {
    return schema.validateSync(data);
  },
};
